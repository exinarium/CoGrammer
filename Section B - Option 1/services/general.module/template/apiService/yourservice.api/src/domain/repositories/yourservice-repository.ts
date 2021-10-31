import mongodb, { ObjectID, ObjectId } from 'mongodb';
import { YourServiceDataModel } from '../models/yourservice-datamodel';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';

export class YourServiceRepository {
    constructor(private config: Config) {}

    async createAsync(model: YourServiceDataModel, user: any): Promise<YourServiceDataModel> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
            const connection = await dataContext.connect();

            const collection = connection
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            model._id = undefined;
            model.isDeleted = false;
            model.version = 1;

            const result = await collection.insertOne(model);

            connection.close();
            dataContext.close();

            model._id = result.insertedId;

            const event: AuditLogEvent<YourServiceDataModel> = {
                objectId: new ObjectID(),
                eventName: 'YourServiceCreatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: -1, //TODO: CHANGE MODULE NUMBER
            };

            await new AuditLogProducer().produceAsync(event);

            return model;
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async updateAsync(model: YourServiceDataModel, user: any): Promise<YourServiceDataModel> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
            const connection = await dataContext.connect();

            const collection = connection
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
                        _id: new ObjectId(model._id),
                        userId: new ObjectId(user._id),
                    })
                    .toArray();
            }

            if (!existingRecord || !existingRecord[0]?.version) {
                throw new Error('Record does not exist in database');
            }

            if (existingRecord[0]?.version > model.version) {
                throw new Error('Conflict detected, version out of date');
            }

            model.version++;
            await collection.updateOne(
                { _id: new ObjectID(model._id) },
                {
                    $set: {
                        //TODO: ADD MODEL FIELDS
                    },
                }
            );

            connection.close();
            dataContext.close();

            const event: AuditLogEvent<YourServiceDataModel> = {
                objectId: new ObjectID(),
                eventName: 'YourServiceUpdatedEvent',
                version: model.version,
                data: model,
                producedAt: new Date(),
                module: -1, //TODO: CHANGE MODULE NUMBER
            };

            await new AuditLogProducer().produceAsync(event);

            return model;
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async deleteAsync(id: ObjectID, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
            const connection = await dataContext.connect();

            const collection = connection
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

            existingRecord[0].isDeleted = true;
            existingRecord[0].version++;

            const result = await collection.updateOne(
                { _id: new ObjectID(id) },
                { $set: { isDeleted: true, version: existingRecord[0].version } }
            );

            connection.close();
            dataContext.close();

            const event: AuditLogEvent<YourServiceDataModel> = {
                objectId: new ObjectID(),
                eventName: 'YourServiceDeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: -1, //TODO: CHANGE MODULE NUMBER
            };

            await new AuditLogProducer().produceAsync(event);

            return result.modifiedCount > 0;
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async undeleteAsync(id: ObjectID, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
            const connection = await dataContext.connect();

            const collection = connection
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

            existingRecord[0].isDeleted = false;
            existingRecord[0].version++;

            const result = await collection.updateOne(
                { _id: new ObjectID(id) },
                { $set: { isDeleted: false, version: existingRecord[0].version } }
            );

            const event: AuditLogEvent<YourServiceDataModel> = {
                objectId: new ObjectID(),
                eventName: 'YourServiceUndeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: -1, //TODO: CHANGE MODULE NUMBER
            };

            await new AuditLogProducer().produceAsync(event);

            connection.close();
            dataContext.close();

            return result.modifiedCount > 0;
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async lookupAsync(
        id: ObjectID,
        searchString: string,
        start: number,
        limit: number,
        user: any
    ): Promise<YourServiceDataModel[]> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
            const connection = await dataContext.connect();

            const collection = connection
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            let existingRecords = [];

            if (id) {
                if (user.isAdminUser) {
                    existingRecords = await collection
                        .find({
                            _id: new ObjectId(id),
                            organizationId: new ObjectId(user.organization._id),
                            isDeleted: false,
                        })
                        .project({})
                        .skip(start)
                        .limit(limit)
                        .toArray();
                } else {
                    existingRecords = await collection
                        .find({
                            _id: new ObjectId(id),
                            userId: new ObjectId(user._id),
                            isDeleted: false,
                        })
                        .project({})
                        .skip(start)
                        .limit(limit)
                        .toArray();
                }
            } else {
                if (user.isAdminUser) {
                    existingRecords = await collection
                        .find({})
                        .filter({
                            $and: [
                                {
                                    organizationId: new ObjectId(user.organizationId),
                                },
                                {
                                    isDeleted: false,
                                },
                                {
                                    $or: [
                                        //TODO: ADD SEARCH FIELDS
                                    ],
                                },
                            ],
                        })
                        .project({})
                        .skip(start)
                        .limit(limit)
                        .toArray();
                } else {
                    existingRecords = await collection
                        .find({})
                        .filter({
                            $and: [
                                {
                                    userId: new ObjectId(user._id),
                                },
                                {
                                    isDeleted: false,
                                },
                                {
                                    $or: [
                                        //TODO: ADD SEARCH FIELDS
                                    ],
                                },
                            ],
                        })
                        .project({})
                        .skip(start)
                        .limit(limit)
                        .toArray();
                }
            }

            connection.close();
            dataContext.close();

            return existingRecords;
        } catch (ex) {
            dataContext.close();
            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
