import { IKeyRespository } from './ikey-repository';
import { Config } from '../config/config';
import mongodb from 'mongodb';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class KeyRepository implements IKeyRespository {
    constructor(private config: Config) {}

    async getEncryptionKeyAsync(type: string): Promise<string> {
        let dataContext: mongodb.MongoClient;
        let result: any;

        try {
            const connectionString = this.config.configurationDatabase.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const database = dataContext.db(this.config.configurationDatabase.databaseName);
            const collection = database.collection(this.config.configurationDatabase.collectionName);

            const filter = { name: type };
            result = await collection.findOne(filter);

        } catch (ex) {
            const ERROR_MESSAGE = 'Error in Authentication while retrieving encryption keys from the database';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result?.value;
    }
}
