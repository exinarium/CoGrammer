import mongodb, { ObjectID, FilterQuery, ObjectId } from 'mongodb';
import { CandidateInteractionDataModel } from '../models/candidateinteraction-datamodel';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist/';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';
import { connect } from 'http2';

export class CandidateInteractionRepository {
    constructor(private config: Config) { }

    async createAsync(model: CandidateInteractionDataModel, user: any): Promise<CandidateInteractionDataModel> {
        let dataContext: mongodb.MongoClient;
        let resultRecord: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            resultRecord = await this.checkProfileConsent(model.profileId, user)
                .then(async (data) => {

                    if (data) {
                        dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

                        const collection = dataContext
                            .db(this.config.databaseConfig.databaseName)
                            .collection(this.config.databaseConfig.collectionName);

                        model._id = undefined;
                        model.isDeleted = false;
                        model.version = 1;
                        model.modifiedDate = new Date();
                        model.username = user.name;

                        const result = await collection.insertOne(model);

                        model._id = result.insertedId;

                        model.clientImage = '';
                        const event: AuditLogEvent<CandidateInteractionDataModel> = {
                            objectId: new ObjectID(),
                            eventName: 'CandidateInteractionCreatedEvent',
                            version: model.version,
                            data: model,
                            producedAt: new Date(),
                            module: 3,
                        };

                        await new AuditLogProducer().produceAsync(event);

                        return model;
                    } else {

                        return;
                    }
                });
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return resultRecord;
    }

    async updateAsync(model: CandidateInteractionDataModel, user: any): Promise<CandidateInteractionDataModel> {
        let dataContext: mongodb.MongoClient;
        let result: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            result = await this.checkProfileConsent(model.profileId, user)
                .then(async (data) => {

                    if (data) {
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
                        model.modifiedDate = new Date();
                        model.username = user.name;

                        await collection.updateOne(
                            { _id: new ObjectID(model._id) },
                            {
                                $set: {
                                    clientImage: model.clientImage,
                                    meetingAddress: model.meetingAddress,
                                    temperature: model.temperature,
                                    clientClassification: model.clientClassification,
                                    suspectedCovid19: model.suspectedCovid19,
                                    symptomsCovid19: model.symptomsCovid19,
                                    directContactCovid19: model.directContactCovid19,
                                    indirectContactCovid19: model.indirectContactCovid19,
                                    testedCovid19: model.testedCovid19,
                                    travelledProvincially: model.travelledProvincially,
                                    travelledInternationally: model.travelledInternationally,
                                    autoImmuneDisease: model.autoImmuneDisease,
                                    additionalNotes: model.additionalNotes,
                                    additionalGroupMembers: model.additionalGroupMembers,
                                    confirmInformationCorrect: model.confirmInformationCorrect,
                                    version: model.version,
                                    modifiedDate: model.modifiedDate,
                                    username: model.username
                                },
                            }
                        );

                        model.clientImage = '';
                        const event: AuditLogEvent<CandidateInteractionDataModel> = {
                            objectId: new ObjectID(),
                            eventName: 'CandidateInteractionUpdatedEvent',
                            version: model.version,
                            data: model,
                            producedAt: new Date(),
                            module: 3,
                        };

                        await new AuditLogProducer().produceAsync(event);

                        return model;
                    }
                    else {
                        return;
                    }
                });
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result;
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

            existingRecord[0].isDeleted = true;
            existingRecord[0].version++;

            result = await collection.updateOne(
                { _id: new ObjectID(id) },
                { $set: { isDeleted: true, version: existingRecord[0].version } }
            );

            existingRecord[0].clientImage = '';
            const event: AuditLogEvent<CandidateInteractionDataModel> = {
                objectId: new ObjectID(),
                eventName: 'CandidateInteractionDeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: 3,
            };

            await new AuditLogProducer().produceAsync(event);


        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result.modifiedCount > 0;
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

            existingRecord[0].isDeleted = false;
            existingRecord[0].version++;

            result = await collection.updateOne(
                { _id: new ObjectID(id) },
                { $set: { isDeleted: false, version: existingRecord[0].version } }
            );

            existingRecord[0].clientImage = '';
            const event: AuditLogEvent<CandidateInteractionDataModel> = {
                objectId: new ObjectID(),
                eventName: 'CandidateInteractionUndeletedEvent',
                version: existingRecord[0].version,
                data: existingRecord[0],
                producedAt: new Date(),
                module: 3,
            };

            await new AuditLogProducer().produceAsync(event);
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result.modifiedCount > 0;
    }

    async lookupAsync(
        id: ObjectID,
        searchString: string,
        start: number,
        limit: number,
        user: any,
        isAdmin: boolean,
        candidateProfileId: string
    ): Promise<CandidateInteractionDataModel[]> {
        let dataContext: mongodb.MongoClient;
        let model: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            model = await this.checkProfileConsent(new ObjectId(candidateProfileId), user)
                .then(async (data) => {

                    if (data) {
                        dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

                        const collection = dataContext
                            .db(this.config.databaseConfig.databaseName)
                            .collection(this.config.databaseConfig.collectionName);

                        let existingRecords = [];

                        if (id) {
                            if (user.isAdminUser && isAdmin) {
                                existingRecords = await collection
                                    .find({
                                        _id: new ObjectId(id),
                                        profileId: new ObjectID(candidateProfileId),
                                        organizationId: new ObjectId(user.organization._id),
                                        isDeleted: false,
                                    })
                                    .project({})
                                    .sort({ modifiedDate: -1 })
                                    .skip(start)
                                    .limit(limit)
                                    .toArray();
                            } else {
                                existingRecords = await collection
                                    .find({
                                        _id: new ObjectId(id),
                                        profileId: new ObjectID(candidateProfileId),
                                        userId: new ObjectId(user._id),
                                        isDeleted: false,
                                    })
                                    .project({})
                                    .sort({ modifiedDate: -1 })
                                    .skip(start)
                                    .limit(limit)
                                    .toArray();
                            }
                        } else {
                            if (user.isAdminUser && isAdmin) {
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
                                                profileId: new ObjectID(candidateProfileId),
                                            },
                                            {
                                                $or: [{ meetingAddress: new RegExp(`${searchString}`) }],
                                            },
                                        ],
                                    })
                                    .project({ clientImage: 0 })
                                    .sort({ modifiedDate: -1 })
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
                                                profileId: new ObjectID(candidateProfileId),
                                            },
                                            {
                                                $or: [{ meetingAddress: new RegExp(`${searchString}`) }],
                                            },
                                        ],
                                    })
                                    .project({ clientImage: 0 })
                                    .sort({ modifiedDate: -1 })
                                    .skip(start)
                                    .limit(limit)
                                    .toArray();
                            }
                        }

                        return existingRecords;
                    }
                    else {
                        return;
                    }
                });
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model;
    }

    private async checkProfileConsent(profileId: ObjectID, user: any): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let existingRecords: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db('CandidateProfile')
                .collection('CandidateProfile');

            existingRecords = [];


            existingRecords = await collection
                .find({
                    _id: new ObjectId(profileId),
                    organizationId: new ObjectId(user.organization._id),
                    isDeleted: false,
                    covid19Consent: true
                })
                .project({})
                .skip(0)
                .limit(1)
                .toArray();

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in CandidateInteraction while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return existingRecords.length > 0;
    }
}
