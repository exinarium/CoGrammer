import { ObjectID } from 'mongodb';
import { Role } from './user-role';

export class User {
    constructor(
        public _id: ObjectID,
        public userId: ObjectID,
        public organizationId: ObjectID,
        public name: string,
        public email: string,
        public organization: object,
        public paymentPlan: object,
        public activeIntegrations: object,
        public activeCampaignTagName: string = '',
        public isAdminUser: boolean = false,
        public roles: Role[],
        public version: number = 1,
        public isDeleted: boolean = false
    ) {}
}
