import { IRepository } from './irepository';
import mongodb from 'mongodb';
import { MetadataModel } from '../models/metadataModel';

export class Repository implements IRepository {
    constructor(private config: any) { }

    async WriteAsync(data: MetadataModel) {

        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.apiMetrics.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.apiMetrics.databaseConfig.databaseName)
                .collection(this.config.apiMetrics.databaseConfig.collectionName);

            const result = await collection.insertOne(data);

            return result.insertedCount > 0;
        }
        finally {
            await dataContext?.close();
        }
    }
}
