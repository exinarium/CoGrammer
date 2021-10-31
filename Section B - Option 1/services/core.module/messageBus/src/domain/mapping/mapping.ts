import { Message } from '../models/message';
import { ObjectId } from 'mongodb';
import { ProcessStatus } from '../models/process-status';

export class Mapping {
    mapToMessage(message: any, topic: string, processStatus: ProcessStatus): Message {

        const content = JSON.stringify(message);

        if (content && content !== '') {

            return new Message(new ObjectId(), content, processStatus, topic);
        } else {
            return;
        }
    }
}
