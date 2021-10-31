import { ObjectID } from 'mongodb';

export class YourServiceDataModel {
    constructor(
        public _id: ObjectID,
        public userId: ObjectID,
        public organizationId: ObjectID,
        //TODO: ADD MODEL FIELDS
        public version: number = 1,
        public isDeleted: boolean = false
    ) {}
}
