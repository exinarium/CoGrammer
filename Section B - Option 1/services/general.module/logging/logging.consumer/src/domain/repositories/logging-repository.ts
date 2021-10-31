import { ILoggingRepository } from './ilogging-repository';
import mongodb from 'mongodb';
import { LoggingDataModel } from '../models/logging-datamodel';
import { LoggingMessage } from '../../../../logging.dto/src';
import { Config } from '../config/config';

export class LoggingRepository implements ILoggingRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async doAsync(message: any): Promise<boolean> {
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

            result = await collection.insertOne(message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while consuming a message in the logging consumer: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);
            throw ex;
        }
        finally {

            await dataContext?.close();
        }

        return result?.insertedCount > 0;
    }
}
