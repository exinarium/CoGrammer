import mongodb from 'mongodb';

export class ActiveCampaignIntegrationMessage<T> {
    constructor(public id: mongodb.ObjectID, public data: T, public version: number, public timestamp: Date) {}
}
