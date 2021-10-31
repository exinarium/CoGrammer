import mongodb, { ObjectID, FilterQuery, ObjectId } from 'mongodb';
import { OrganizationDataModel } from '../models/organization-datamodel';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist/';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';
import { EmailProducer } from 'covidscreener-email/dist';

export class OrganizationRepository {
    constructor(private config: Config) { }

    async createAsync(model: OrganizationDataModel, contactName: string): Promise<OrganizationDataModel> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            let collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('User');

            const existingRecord = await collection.findOne({
                email: model.mainUserEmail,
                isDeleted: false
            });

            if (existingRecord) {
                throw new Error('The user already exists on the system');
            }

            collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            const result = await collection.insertOne(model);
            model._id = result.insertedId;

            const event: AuditLogEvent<OrganizationDataModel> = {
                objectId: new ObjectID(),
                eventName: 'OrganizationCreatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: 1,
            };

            await new AuditLogProducer().produceAsync(event);

            collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('User');

            const verifyCode = new ObjectID().toHexString();

            const user = await collection.insertOne({
                name: contactName,
                email: model.mainUserEmail,
                organizationId: model._id,
                isVerified: false,
                isDeleted: false,
                isAdminUser: true,
                version: 1,
                modifiedBy: 'System',
                modifiedDate: new Date(),
                verifiedCode: verifyCode
            });

            if(user.insertedCount > 0) {

                new EmailProducer().produceAsync({
                    eventName: 'EmailEvent',
                    id: new ObjectID(),
                    producedAt: new Date(),
                    version: 1,
                    data: {
                        to: [model.mainUserEmail],
                        from: 'support@creativ360.com',
                        subject: 'You have been loaded to the 2020Screener Application!',
                        message: '<b>A new account has been created for you on the 2020Screener application.</b><br /><br />Please follow the link ' +
                            'to create your password and confirm your email address. Please note that this link is only usable one time:<br /><br />' +
                            `https://2020screener.com/#/verify/${verifyCode}` +
                            '<br /><br />Kind regards,<br />The Creativ360 team',
                        cc: [],
                        attachments: []
                    },
                    produceMessage: true

                })
            }

        } catch (ex) {

            const ERROR_MESSAGE = 'Error in Organization while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model;
    }

    async updateAsync(model: OrganizationDataModel, user: any): Promise<OrganizationDataModel> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            const existingRecord = await collection.findOne({
                _id: new ObjectId(user.organizationId),
            });

            if (!existingRecord || !existingRecord.version) {
                throw new Error('Record does not exist in database');
            }

            if (existingRecord.version > model.version) {
                throw new Error('Conflict detected, version out of date');
            }

            model.version++;
            await collection.updateOne(
                { _id: new ObjectId(user.organizationId) },
                {
                    $set: {
                        organizationName: model.organizationName,
                        organizationCountryCode: model.organizationCountryCode,
                        mainUserEmail: model.mainUserEmail,
                        version: model.version,
                    },
                }
            );

            const event: AuditLogEvent<OrganizationDataModel> = {
                objectId: new ObjectID(),
                eventName: 'OrganizationUpdatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: 1,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in Organization while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model;
    }

    /**
     * Delete an organization account in the database.
     *
     * @param organizationId The unique organization ID
     * @param user The authenticated user in the current context
     *
     * @returns Boolean - Success or failure
     */
    async deleteAsync(organizationId: string, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            const existingRecord = await collection.findOne({
                _id: new ObjectId(user.organizationId),
            });

            if (!existingRecord || !existingRecord.version) {
                throw new Error('Record does not exist in database');
            }

            existingRecord.version = existingRecord.version + 1;
            existingRecord.isDeleted = true;

            result = await collection.updateOne(
                { _id: new ObjectId(user.organizationId) },
                {
                    $set: {
                        isDeleted: true
                    },
                }
            );

            const event: AuditLogEvent<OrganizationDataModel> = {
                objectId: new ObjectID(),
                eventName: 'OrganizationDeletedEvent',
                version: existingRecord.version,
                data: existingRecord,
                producedAt: new Date(),
                module: 1,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in Organization while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result.modifiedCount > 0;
    }

    /**
     * Undelete an organization account in the database.
     *
     * @param organizationId The unique organization ID
     * @param user The authenticated user in the current context
     *
     * @returns Boolean - Success or failure
     */
    async undeleteAsync(organizationId: string, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            const existingRecord = await collection.findOne({
                _id: new ObjectId(user.organizationId),
            });

            if (!existingRecord || !existingRecord.version) {
                throw new Error('Record does not exist in database');
            }

            existingRecord.version = existingRecord.version + 1;
            existingRecord.isDeleted = false;

            result = await collection.updateOne(
                { _id: new ObjectId(user.organizationId) },
                {
                    $set: {
                        isDeleted: false
                    },
                }
            );

            const event: AuditLogEvent<OrganizationDataModel> = {
                objectId: new ObjectID(),
                eventName: 'OrganizationUndeletedEvent',
                version: existingRecord.version,
                data: existingRecord,
                producedAt: new Date(),
                module: 1,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in Organization while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result.modifiedCount > 0;
    }

    async lookupAsync(user: any): Promise<OrganizationDataModel> {
        let dataContext: mongodb.MongoClient;
        let existingRecord: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            existingRecord = await collection.findOne({
                _id: new ObjectId(user.organizationId),
            });

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in Organization while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return existingRecord;
    }
}
