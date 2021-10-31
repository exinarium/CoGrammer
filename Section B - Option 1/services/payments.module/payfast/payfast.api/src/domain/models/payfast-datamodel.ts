import { ObjectID } from 'mongodb';

export class PayfastDataModel {
    constructor(
        public _id: ObjectID,
        public userId: ObjectID,
        public organizationId: ObjectID,
        public amount: number,
        public planNumber: number,
        public isFree: boolean,
        public version: number = 1,
        public isDeleted: boolean = false
    ) {}
}
