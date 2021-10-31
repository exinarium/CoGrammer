import { Config } from "../config/config";
import { MongoClient } from "mongodb";
import { LoggingProducer } from "covidscreener-logging/dist/logging.producer/src";
import { LogPriority } from "covidscreener-logging/dist/logging.producer/src/domain/models/log-priority";

export class ExcelIntegrationRepository {

    constructor(private config: Config) { }

    async checkPaymentPlan(user: any): Promise<boolean> {

        let dataContext: MongoClient;
        let result: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            const plan = await collection
                .findOne({
                    planNumber: user?.organization?.paymentPlan
                })

            result = plan?.allowExcelIntegration === true;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in ExcelIntegrationAPI while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return result;
    }
}