import { ObjectID } from 'mongodb';

export class OrganizationDataModel {
    constructor(
        public _id: ObjectID,
        public organizationName: string,
        public organizationCountryCode: string,
        public mainUserEmail: string,
        public paymentPlan: number,
        public createdDate: Date,
        public version: number = 1,
        public isDeleted: boolean = false,
        public activeCampaign: object = null,
        public googleApi: object = null,
        public hubspot: object = null,
        public payments: object = {}
    ) { }
}
