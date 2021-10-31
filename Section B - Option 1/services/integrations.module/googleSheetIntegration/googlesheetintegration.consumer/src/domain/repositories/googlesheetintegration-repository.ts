import mongodb, { ObjectId } from 'mongodb';
import { GoogleSheetIntegrationDataModel } from '../models/googlesheetintegration-datamodel';
import { GoogleSheetIntegrationMessage } from '../../../../googlesheetintegration.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class GoogleSheetIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async getGoogleToken(message: GoogleSheetIntegrationMessage<GoogleSheetIntegrationDataModel>): Promise<any> {
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

            result = await collection.findOne({
                _id: new ObjectId(message.data.organizationId)
            });
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in GoogleSheetIntegration while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        return result;
    }
}
