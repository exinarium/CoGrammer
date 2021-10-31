import { Repository } from '../repositories/repository';
import { Mapping } from '../mapping/mapping';
import { ProcessStatus } from '../models/process-status';
import { Message } from '../models/message';
import { ObjectId } from 'mongodb';

export class Aggregate {
    constructor(private repository: Repository, private mapper: Mapping) { }

    async sendMessage(topic: string, message: any): Promise<boolean> {

        const messageObject = this.mapper.mapToMessage(message, topic, ProcessStatus.new);

        if(!messageObject) {
            return false;
        }

        const result = await this.repository.createAsync(messageObject);

        if(result) {
            return true;
        } else {
            return false;
        }
    }

    async consumeMessage(topic: string, proccessStatus: ProcessStatus): Promise<Message> {

        const result = await this.repository.readAndModify(topic, proccessStatus);
        return result;
    }

    async commitMessage(id: ObjectId, proccessStatus: ProcessStatus, doDelete: boolean = false): Promise<Message> {

        const result = await this.repository.complete(id, proccessStatus, doDelete);
        return result;
    }
}
