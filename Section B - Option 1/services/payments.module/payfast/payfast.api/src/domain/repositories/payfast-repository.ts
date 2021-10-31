import mongodb, { ObjectID, ObjectId, Timestamp } from 'mongodb';
import { PayfastDataModel } from '../models/payfast-datamodel';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';
import axios from 'axios';
import { addMonths, format } from 'date-fns';
import md5 from 'md5';

export class PayfastRepository {

    private testingString: string = '';

    constructor(private config: Config) {

        if (process?.env?.environment === 'development') {
            this.testingString = '?testing=true';
        }
    }

    async cancelAsync(user: any): Promise<boolean> {

        const existingRecord = await this.getOrganizationDataAsync(user);

        if (existingRecord) {
            const result = await this.cancelPayfastSubscription(existingRecord);
            return result;
        } else {
            return false;
        }
    }

    async updateAsync(model: PayfastDataModel, user: any): Promise<boolean> {

        const existingRecord = await this.getOrganizationDataAsync(user);

        if (existingRecord) {
            const result = await this.updatePayfastSubscription(model, existingRecord);

            return result;
        } else {
            return false;
        }
    }

    async getOrganizationDataAsync(user: any): Promise<any> {

        let dataContext: mongodb.MongoClient;
        let existingRecord;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            if (user.isAdminUser) {
                existingRecord = await collection
                    .findOne({
                        _id: new ObjectId(user.organization._id),
                    });
            }

            if (!existingRecord || !existingRecord?.version) {
                throw new Error('Record does not exist in database');
            }

            const paymentPlan = existingRecord?.paymentPlan;
            const planStatus = existingRecord?.payments?.paymentStatus;

            if (paymentPlan < 1 || !paymentPlan || !planStatus || (planStatus !== 'Active' && planStatus !== 'Downgrade')) {
                throw new Error('There are currently no active payment plans on this organization');
            }

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in Payfast while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            dataContext.close();
        }

        return existingRecord;
    }

    async cancelPayfastSubscription(organization: any): Promise<boolean> {

        const merchantId = this.config.payfastConfig.merchantId;
        const version = 'v1';
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

        const signatureString = `merchant-id=${encodeURIComponent(merchantId)}&passphrase=${encodeURIComponent(this.config.payfastConfig.passphrase)}&timestamp=${encodeURIComponent(timestamp)}&version=${encodeURIComponent(version)}`;
        const signature = md5(signatureString);

        const cancelPayfastHeader = {
            'merchant-id': merchantId,
            'version': version,
            'timestamp': timestamp,
            'signature': signature
        }

        try {
            const cancelResult = await axios.put(`${this.config.payfastConfig.url}/subscriptions/${organization.payments.subscriptionToken}/cancel${this.testingString}`,
                {},
                { headers: cancelPayfastHeader });

            return true;
        }
        catch (ex) {

            return false;
        }
    }

    async updatePayfastSubscription(model: PayfastDataModel, organization: any): Promise<boolean> {

        const merchantId = this.config.payfastConfig.merchantId;
        const version = 'v1';
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

        const amount = Number(model.amount);

        const signatureString = `amount=${encodeURIComponent(amount)}&merchant-id=${encodeURIComponent(merchantId)}&passphrase=${encodeURIComponent(this.config.payfastConfig.passphrase)}&timestamp=${encodeURIComponent(timestamp)}&version=${encodeURIComponent(version)}`;
        const signature = md5(signatureString);

        const updatePayfastHeader = {
            'merchant-id': merchantId,
            'version': version,
            'timestamp': timestamp,
            'signature': signature
        }

        const updatePayfastBody = {

            'amount': Number(amount)
        }

        try {

            let result;

            if (model.isFree) {

                result = await this.updateByNotificationAsync(new ObjectId(organization._id), model.planNumber, new Date(organization.payments.paymentDate), false, '', true, true);

            } else {

                const updateResult = await axios.patch(`${this.config.payfastConfig.url}/subscriptions/${organization.payments.subscriptionToken}/update${this.testingString}`,
                    updatePayfastBody,
                    { headers: updatePayfastHeader });

                result = await this.updateByNotificationAsync(new ObjectId(organization._id), model.planNumber, new Date(organization.payments.paymentDate), false, updateResult?.data?.token, true);
            }

            return result;
        }
        catch (ex) {

            return false;
        }
    }

    async updateByNotificationAsync(organizationId: ObjectID, paymentPlan: number, paymentDate: Date, paymentStatus: boolean, subscriptionToken: string, isDowngrade: boolean = false, isFree: boolean = false): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let result = false;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            let existingRecord;

            existingRecord = await collection
                .findOne({
                    _id: new ObjectId(organizationId)
                });

            if (!existingRecord || !existingRecord?.version) {
                throw new Error('Record does not exist in database');
            }

            existingRecord.version++;
            const nextBillingDate = addMonths(paymentDate, 1);
            let cancelSuccess = true;

            if (paymentStatus) {

                if (subscriptionToken !== existingRecord?.payments?.subscriptionToken && existingRecord?.payments?.subscriptionToken && existingRecord?.payments?.subscriptionToken !== '') {

                    cancelSuccess = await this.cancelPayfastSubscription(existingRecord);
                }

                if (cancelSuccess) {
                    if (existingRecord?.payments?.paymentPlan < paymentPlan &&
                        existingRecord?.payments?.subscriptionToken === subscriptionToken) {

                        paymentPlan = existingRecord.payments.paymentPlan;

                        if (existingRecord?.payments?.paymentPlan !== existingRecord.paymentPlan) {

                            await this.adjustDowngradeData(paymentPlan, new ObjectID(organizationId));
                        }
                    }

                    const updated = await collection.updateOne(
                        { _id: new ObjectID(organizationId) },
                        {
                            $set: {
                                'paymentPlan': Number(paymentPlan),
                                'payments.paymentPlan': Number(paymentPlan),
                                'payments.paymentStatus': 'Active',
                                'payments.paymentDate': paymentDate,
                                'payments.nextBillingDate': nextBillingDate,
                                'payments.subscriptionToken': subscriptionToken
                            },
                        }
                    );

                    result = updated.modifiedCount > 0;

                    const event: AuditLogEvent<any> = {
                        objectId: new ObjectID(),
                        eventName: 'PayfastUpdatedEvent',
                        version: existingRecord.version,
                        data: {
                            type: 'By Notification',
                            organizationId: organizationId.toHexString(),
                            paymentPlan,
                            paymentDate,
                            paymentStatus: 'Complete',
                            subscriptionToken
                        },
                        producedAt: new Date(),
                        module: 6,
                    };

                    await new AuditLogProducer().produceAsync(event);
                }

            } else {

                if (isDowngrade) {

                    if (isFree) {

                        const updated = await collection.updateOne(
                            { _id: new ObjectID(organizationId) },
                            {
                                $set: {
                                    paymentPlan: 0,
                                    payments: {}
                                },
                            }
                        );

                        result = updated.modifiedCount > 0;

                        if (result) {
                            await this.cancelPayfastSubscription(existingRecord);
                            await this.adjustDowngradeData(0, new ObjectID(organizationId));
                        }

                        const event: AuditLogEvent<any> = {
                            objectId: new ObjectID(),
                            eventName: 'PayfastUpdatedEvent',
                            version: existingRecord.version,
                            data: {
                                type: 'By Notification',
                                organizationId: organizationId.toHexString(),
                                paymentPlan,
                                paymentDate,
                                paymentStatus: 'Converted To Free',
                                subscriptionToken
                            },
                            producedAt: new Date(),
                            module: 6,
                        };

                        await new AuditLogProducer().produceAsync(event);

                    } else {

                        const updated = await collection.updateOne(
                            { _id: new ObjectID(organizationId) },
                            {
                                $set: {
                                    'payments.paymentStatus': isFree ? 'Free' : 'Downgrade',
                                    'payments.paymentPlan': isFree ? 0 : Number(paymentPlan)
                                },
                            }
                        );

                        result = updated.modifiedCount > 0;
                    }

                } else {

                    const updated = await collection.updateOne(
                        {
                            _id: new ObjectID(organizationId),
                            'payments.subscriptionToken': subscriptionToken
                        },
                        {
                            $set: {
                                'payments.paymentStatus': 'Cancelled'
                            },
                        }
                    );

                    const event: AuditLogEvent<any> = {
                        objectId: new ObjectID(),
                        eventName: 'PayfastUpdatedEvent',
                        version: existingRecord.version,
                        data: {
                            type: 'By Notification',
                            organizationId: organizationId.toHexString(),
                            paymentPlan,
                            paymentDate,
                            paymentStatus: 'Cancelled',
                            subscriptionToken
                        },
                        producedAt: new Date(),
                        module: 6,
                    };

                    await new AuditLogProducer().produceAsync(event);

                    result = updated.modifiedCount > 0;
                }
            }
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in Payfast while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            dataContext.close();
        }

        return result;
    }

    async adjustDowngradeData(paymentPlan: number, organizationId: ObjectID): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let organizationResult = true;
        let userResult = true;
        let candidateResult = true;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            let collection = dataContext
                .db('Users')
                .collection('PaymentPlans');

            let paymentPlanRecord;

            paymentPlanRecord = await collection
                .findOne({
                    planNumber: paymentPlan
                });

            if (!paymentPlanRecord) {
                throw new Error('Payment plan does not exist in database');
            }

            // Update Organization Integrations
            collection = dataContext
                .db('Users')
                .collection('Organization');

            const organization = await collection
                .findOne({
                    _id: new ObjectID(organizationId)
                });

            if (!organization) {
                organizationResult = true;
            } else {

                const organizationResults = await collection.updateOne(
                    { _id: new ObjectID(organizationId) },
                    {
                        $set: {
                            'activeCampaign': paymentPlanRecord.allowActiveCampaignIntegration ? organization.activeCampaign : null,
                            'googleApi': paymentPlanRecord.allowGoogleIntegration ? organization.googleApi : null,
                            'hubspot': paymentPlanRecord.allowHubspotIntegration ? organization.hubspot : null,
                        },
                    }
                );

                organizationResult = organizationResults.matchedCount > 0;
            }

            const organizationEvent: AuditLogEvent<any> = {
                objectId: new ObjectID(),
                eventName: 'PlanDowngraded',
                version: 1,
                data: {
                    integrationsBroken: {
                        activeCampaign: !paymentPlanRecord.allowActiveCampaignIntegration,
                        googleApi: !paymentPlanRecord.allowGoogleIntegration,
                        hubspot: !paymentPlanRecord.allowHubspotIntegration
                    }
                },
                producedAt: new Date(),
                module: 1,
            };

            await new AuditLogProducer().produceAsync(organizationEvent);

            // Update Users
            collection = dataContext
                .db('Users')
                .collection('User');

            const users = await collection
                .find({
                    organizationId: new ObjectID(organizationId),
                    isDeleted: false,
                    email: {
                        $not: {
                            $regex: `${organization.mainUserEmail}`
                        }
                    }
                })
                .sort({ 'modifiedDate': -1 })
                .project({ _id: 1 })
                .toArray();

            let userIds: ObjectID[] = [];
            users.forEach(element => { userIds.push(element?._id) });

            if (userIds.length <= 0) {
                userResult = true;
            } else {

                if (userIds.length > paymentPlanRecord.maxUsers) {

                    userIds = userIds.slice(paymentPlanRecord.maxUsers.length - 1);

                    const userResults = await collection.updateMany(
                        { _id: { $in: userIds } },
                        {
                            $set: {
                                isDeleted: true
                            },
                        }
                    );

                    const userEvent: AuditLogEvent<any> = {
                        objectId: new ObjectID(),
                        eventName: 'PlanDowngraded',
                        version: 1,
                        data: {
                            userIdsDeactivated: userIds
                        },
                        producedAt: new Date(),
                        module: 0,
                    };

                    await new AuditLogProducer().produceAsync(userEvent);

                    userResult = userResults.matchedCount > 0;
                }
            }

            // Update Contacts
            collection = dataContext
                .db('CandidateProfile')
                .collection('CandidateProfile');

            const contacts = await collection
                .find({
                    organizationId: new ObjectID(organizationId),
                    isDeleted: false
                })
                .sort({ 'modifiedDate': -1 })
                .project({ _id: 1 })
                .toArray();

            let contactIds: ObjectID[] = [];
            contacts.forEach(element => { contactIds.push(element?._id) });

            if (contactIds.length <= 0) {
                candidateResult = true
            }

            if (contactIds.length > paymentPlanRecord.maxProfiles) {
                contactIds = contactIds.slice(paymentPlanRecord.maxProfiles);

                const contactResults = await collection.updateMany(
                    { _id: { $in: contactIds } },
                    {
                        $set: {
                            isDeleted: true
                        },
                    }
                );

                const contactEvent: AuditLogEvent<any> = {
                    objectId: new ObjectID(),
                    eventName: 'PlanDowngraded',
                    version: 1,
                    data: {
                        contactIdsDeactivated: contactIds
                    },
                    producedAt: new Date(),
                    module: 2,
                };

                await new AuditLogProducer().produceAsync(contactEvent);

                candidateResult = contactResults.matchedCount > 0;
            }

        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in Payfast while updating data to match payment plan';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            dataContext.close();
        }

        return organizationResult && userResult && candidateResult;
    }
}
