import mongodb, { ObjectID, FilterQuery, ObjectId } from 'mongodb';
import { UserDataModel } from '../models/user-datamodel';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';
import { SecurityUtils } from '../utilities/security-utils';

export class UserRepository {
    constructor(private config: Config) { }

    async createAsync(model: UserDataModel, user: any): Promise<UserDataModel> {
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

            const organizationCollection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('Organization');

            const paymentPlanCollection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('PaymentPlans');

            const userCount = await collection.count({
                organizationId: new ObjectID(user.organizationId),
                isDeleted: false,
            });

            const organization = await organizationCollection.findOne({ _id: new ObjectID(user.organizationId) });
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization.paymentPlan });

            if (userCount >= paymentPlan.maxUsers) {
                throw new Error(
                    'You have already created the maximum amount of users. Please upgrade your plan to continue'
                );
            }

            model._id = undefined;

            const existingUser = await collection.findOne({ email: model.email, isDeleted: false });
            let result;

            if (!existingUser) {
                model.verifiedCode = new ObjectID().toHexString();
                model.modifiedDate = new Date();
                model.modifiedBy = user.name;
                model.isDeleted = false;
                model.isVerified = false;
                model.version = 1;
                result = await collection.insertOne(model);
            } else {
                throw new Error('Email already registered');
            }

            model._id = result?.insertedId;
            model.password = '';
            model.forgotPasswordCode = '';

            const event: AuditLogEvent<UserDataModel> = {
                objectId: new ObjectID(),
                eventName: 'UserCreatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: 0,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model;
    }

    async updateAsync(model: UserDataModel, user: any): Promise<UserDataModel> {
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

            if (!model._id) {
                throw new Error('Model ID cannot be null when it is an update request');
            }

            let existingRecord;

            if (user.isAdminUser) {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(model._id),
                        organizationId: new ObjectId(user.organization._id),
                    })
                    .toArray();
            } else {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(model.userId),
                        organizationId: new ObjectId(user.organization._id),
                    })
                    .toArray();
            }

            if (!existingRecord || !existingRecord[0].version) {
                throw new Error('Record does not exist in database');
            }

            if (existingRecord[0].version > model.version) {
                throw new Error('Conflict detected, version out of date');
            }

            model.version++;

            if(!user.isAdminUser && !existingRecord[0].isAdminUser) {
                model.isAdminUser = false;
            }

            await collection.updateOne(
                { _id: new ObjectId(model._id) },
                {
                    $set: {
                        name: model.name,
                        roles: model.roles,
                        isAdminUser: model.isAdminUser,
                        version: model.version,
                        modifiedDate: new Date(),
                        modifiedBy: user.name,
                        activeCampaignTagName: model.activeCampaignTagName
                    },
                }
            );

            model.password = '';
            model.verifiedCode = '';
            model.forgotPasswordCode = '';

            const event: AuditLogEvent<UserDataModel> = {
                objectId: new ObjectID(),
                eventName: 'UserUpdatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: 0,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model;
    }

    async deleteAsync(id: ObjectID, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            if (!id) {
                throw new Error('Model ID cannot be null when it is an delete request');
            }

            let existingRecord;

            if (user.isAdminUser) {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(id),
                        organizationId: new ObjectId(user.organization._id),
                    })
                    .toArray();
            } else {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(id),
                        userId: new ObjectId(user._id),
                    })
                    .toArray();
            }

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            if (existingRecord[0].email === user.organization.mainUserEmail) {
                throw new Error('Cannot delete the main member of an organization');
            }

            existingRecord[0].isDeleted = true;
            existingRecord[0].version++;

            result = await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        isDeleted: true,
                        version: existingRecord[0].version,
                        modifiedDate: new Date(),
                        modifiedBy: user.name
                    }
                }
            );

            existingRecord[0].password = '';
            existingRecord[0].verifiedCode = '';
            existingRecord[0].forgotPasswordCode = '';

            const event: AuditLogEvent<UserDataModel> = {
                objectId: new ObjectID(),
                eventName: 'UserDeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: 0,
            };

            await new AuditLogProducer().produceAsync(event);

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result?.modifiedCount > 0;
    }

    async undeleteAsync(id: ObjectID, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            if (!id) {
                throw new Error('Model ID cannot be null when it is an delete request');
            }

            let existingRecord;

            if (user.isAdminUser) {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(id),
                        organizationId: new ObjectId(user.organization._id),
                    })
                    .toArray();
            } else {
                existingRecord = await collection
                    .find({
                        _id: new ObjectId(id),
                        userId: new ObjectId(user._id),
                    })
                    .toArray();
            }

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            const existingActiveRecord = await collection.findOne({ email: existingRecord, isDeleted: false });

            if (existingActiveRecord) {
                throw new Error("The user cannot be restored since the user is already active");
            }

            const organizationCollection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('Organization');

            const paymentPlanCollection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection('PaymentPlans');

            const userCount = await collection.count({
                organizationId: new ObjectID(user.organizationId),
                isDeleted: false,
            });

            const organization = await organizationCollection.findOne({ _id: new ObjectID(user.organizationId) });
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization.paymentPlan });

            if (userCount >= paymentPlan.maxUsers) {
                throw new Error(
                    'You have already created the maximum amount of users. Please upgrade your plan to continue'
                );
            }

            existingRecord[0].isDeleted = false;
            existingRecord[0].version++;

            result = await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        isDeleted: false,
                        version: existingRecord[0].version,
                        modifiedDate: new Date(),
                        modifiedBy: user.name
                    }
                }
            );

            existingRecord[0].password = '';
            existingRecord[0].verifiedCode = '';
            existingRecord[0].forgotPasswordCode = '';

            const event: AuditLogEvent<UserDataModel> = {
                objectId: new ObjectID(),
                eventName: 'UserUndeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: 0,
            };

            await new AuditLogProducer().produceAsync(event);

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result?.modifiedCount > 0;
    }

    async lookupAsync(
        id: ObjectID,
        searchString: string,
        start: number,
        limit: number,
        user: any
    ): Promise<UserDataModel[]> {
        let dataContext: mongodb.MongoClient;
        let existingRecords: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            existingRecords = [];

            if (id) {
                if (user.isAdminUser) {
                    existingRecords = await collection
                        .find({
                            _id: new ObjectId(id),
                            organizationId: new ObjectId(user.organization._id),
                        })
                        .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                        .skip(start)
                        .limit(limit)
                        .toArray();
                } else {
                    existingRecords = await collection
                        .find({
                            _id: new ObjectId(id),
                            organizationId: new ObjectId(user.organization._id),
                        })
                        .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                        .skip(start)
                        .limit(limit)
                        .toArray();
                }
            } else {
                // Search fields
                if (user.isAdminUser && (searchString === '' || searchString === undefined)) {
                    existingRecords = await collection
                        .find({})
                        .filter({
                            $and: [
                                {
                                    organizationId: new ObjectId(user.organizationId),
                                },
                                {
                                    isDeleted: false
                                }
                            ],
                        })
                        .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                        .sort({ name: 1 })
                        .skip(start)
                        .limit(limit)
                        .toArray();
                } else {
                    existingRecords = await collection
                        .find({})
                        .filter({
                            $and: [
                                {
                                    organizationId: new ObjectId(user.organization._id)
                                },
                                {
                                    email: searchString
                                },
                            ],
                        })
                        .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                        .sort({ name: 1 })
                        .skip(start)
                        .limit(limit)
                        .toArray();
                }
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return existingRecords;
    }

    async sendForgotPasswordAsync(email: string): Promise<UserDataModel> {

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

            existingRecord = await collection
                .find({
                    email,
                    isDeleted: false
                })
                .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                .toArray();

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            existingRecord[0].forgotPasswordCode = new ObjectID().toHexString();

            await collection.updateOne(
                { _id: existingRecord[0]._id },
                {
                    $set: {
                        forgotPasswordCode: existingRecord[0].forgotPasswordCode
                    },
                }
            );
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return existingRecord ? existingRecord[0] : null;
    }

    async forgotPasswordAsync(
        requestId: ObjectID,
        forgotPasswordCode: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let result: any;

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
                .find({
                    forgotPasswordCode
                })
                .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                .toArray();

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('The passwords do not match');
            }

            existingRecord[0].password = SecurityUtils.encrypt(newPassword);

            result = await collection.updateOne(
                { _id: existingRecord[0]._id },
                {
                    $set: {
                        password: existingRecord[0].password,
                        forgotPasswordCode: '',
                        isVerified: true
                    },
                }
            );
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result?.modifiedCount > 0;
    }

    async verifyAccountAsync(
        requestId: ObjectID,
        verifyCode: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let result: any;

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
                .find({
                    verifiedCode: verifyCode,
                    isDeleted: false
                })
                .project({ password: 0, verifiedCode: 0, forgotPasswordCode: 0 })
                .toArray();

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('The passwords do not match');
            }

            existingRecord[0].password = SecurityUtils.encrypt(newPassword);
            existingRecord[0].isVerified = true;

            result = await collection.updateOne(
                { _id: existingRecord[0]._id },
                {
                    $set: {
                        password: existingRecord[0].password,
                        isVerified: true,
                        verifiedCode: ''
                    },
                }
            );
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result?.modifiedCount > 0;
    }

    async updatePasswordAsync(
        newPassword: string,
        confirmPassword: string,
        currentPassword: string,
        user: any
    ): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result: any;

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
                .find({
                    _id: new ObjectID(user._id),
                    password: SecurityUtils.encrypt(currentPassword)
                })
                .project({ verifiedCode: 0, forgotPasswordCode: 0 })
                .toArray();

            if (!existingRecord || !existingRecord[0]) {
                throw new Error('Record does not exist in database');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('The passwords do not match');
            }

            existingRecord[0].password = SecurityUtils.encrypt(newPassword);

            result = await collection.updateOne(
                { _id: existingRecord[0]._id },
                {
                    $set: {
                        password: existingRecord[0].password,
                        modifiedDate: new Date(),
                        modifiedBy: user.name
                    },
                }
            );
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in User while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
        finally {
            await dataContext?.close();
        }

        return result?.modifiedCount > 0;
    }
}
