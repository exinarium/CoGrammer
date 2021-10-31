import mongodb from 'mongodb';
import { YourServiceDataModel } from '../models/yourservice-datamodel';
import { YourServiceMessage } from '../../../../yourservice.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class YourServiceRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async doAsync(message: YourServiceMessage<YourServiceDataModel>): Promise<boolean> {
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

            /**
             * Do database operation
             */

            result = undefined;
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in YourService while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        return result;
    }
}
