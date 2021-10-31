import { Aggregate } from './domain/aggregates/aggregate';
import { Repository } from './domain/repositories/repository';
import { Mapping } from './domain/mapping/mapping';
import { Message } from './domain/models/message';
import { ProcessStatus } from './domain/models/process-status';
import { ObjectId } from 'mongodb';

export default class MessageBus {
    private aggregate: Aggregate;
    private repository: Repository;
    private mapper: Mapping;

    constructor(connectionString: string) {

        this.mapper = new Mapping();
        this.repository = new Repository(connectionString);
        this.aggregate = new Aggregate(this.repository, this.mapper);
     }

    async send(topic: string, message: any) : Promise<boolean> {

        return await this.aggregate.sendMessage(topic, message);
    }

    async consume(topic: string, status: ProcessStatus): Promise<Message> {

        return await this.aggregate.consumeMessage(topic, status);
    }

    async commit(_id: ObjectId, status: ProcessStatus, doDelete: boolean = false): Promise<Message> {

        return await this.aggregate.commitMessage(_id, status, doDelete);
    }
}
