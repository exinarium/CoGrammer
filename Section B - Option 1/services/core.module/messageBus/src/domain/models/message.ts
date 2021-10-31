import { ObjectId } from 'mongodb';
import { ProcessStatus } from './process-status';

export class Message {
    constructor(
        public _id: ObjectId,
        public content: any,
        public processStatus: ProcessStatus,
        public topic: string
    ) {}


}
