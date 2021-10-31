import { ObjectID } from 'mongodb';
import { Roles } from './roles-datamodel';

export class UserDataModel {
    constructor(
        public _id: ObjectID,
        public userId: ObjectID,
        public organizationId: ObjectID,
        public name: string,
        public password: string = '',
        public email: string,
        public roles: Roles[],
        public verifiedCode: string = '',
        public forgotPasswordCode: string = '',
        public isAdminUser: boolean = false,
        public version: number = 1,
        public isDeleted: boolean = false,
        public isVerified: boolean = false,
        public modifiedDate: Date = new Date(),
        public modifiedBy: string,
        public activeCampaignTagName: string
    ) {}
}
