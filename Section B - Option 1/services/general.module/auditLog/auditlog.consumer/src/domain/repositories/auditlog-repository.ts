import { IAuditLogRepository } from './iauditlog-repository';
import mongodb from 'mongodb';
import { AuditLogEvent } from '../../../../auditlog.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { DBConfig } from '../config/db-config';

export class AuditLogRepository implements IAuditLogRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async doAsync(message: AuditLogEvent<any>): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result;

        try {
            const dbConfig = await this.getConnectionString(message.module);
            const connectionString = dbConfig?.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext.db(dbConfig.databaseName).collection(dbConfig.collectionName);
            result = await collection.insertOne(message);
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in AuditLog while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
        finally {

            await dataContext?.close();
        }

        return result.insertedCount > 0;
    }

    async getConnectionString(moduleNumber: number): Promise<DBConfig> {
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

            result = await collection.findOne<DBConfig>({ module: moduleNumber });

        } catch (ex) {

            const ERROR_MESSAGE = 'Error while retrieving connection string for module';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
        finally {

            await dataContext?.close();
        }

        return result;
    }
}
