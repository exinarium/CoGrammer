import mongodb, { ObjectId } from 'mongodb';
import { Message } from '../models/message';
import { ProcessStatus } from '../models/process-status';

export class Repository {
    constructor(private connectionString: string) { }

    async createAsync(message: Message): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let result: any;

        try {

            if (this.connectionString === undefined || this.connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(this.connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db('MessageBus')
                .collection('Message');

            result = await (await collection.insertOne(message));
        }
        finally {
            await dataContext?.close();
        }

        return result.insertedCount > 0;
    }

    async readAndModify(topic: string, processStatus: ProcessStatus): Promise<any> {

        let dataContext: mongodb.MongoClient;
        let result: any;

        try {

            if (this.connectionString === undefined || this.connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(this.connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db('MessageBus')
                .collection('Message');

            result = await collection.findOneAndUpdate({ topic, processStatus }, { $set: { processStatus: ProcessStatus.processing } });
        }
        finally {
            await dataContext?.close();
        }

        return result?.value;
    }

    async complete(id: ObjectId, processStatus: ProcessStatus, doDelete: boolean = false): Promise<any> {

        let dataContext: mongodb.MongoClient;
        let result: any;

        try {

            if (this.connectionString === undefined || this.connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(this.connectionString, { useUnifiedTopology: true }).connect();

            if (doDelete) {

                const collection = dataContext
                    .db('MessageBus')
                    .collection('Message');

                result = await collection.findOneAndDelete({ _id: id });

            } else {

                const collection = dataContext
                    .db('MessageBus')
                    .collection('Message');

                result = await collection.findOneAndUpdate({ _id: id }, { $set: { processStatus } });
            }
        }
        finally {
            await dataContext?.close();
        }

        return result?.value;
    }
}
