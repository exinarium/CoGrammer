export class ActiveCampaignIntegrationRequest {
    constructor(public id: string, public produceMessage: boolean, public apiKey: string, public apiUrl: string, public listId: number) {}
}
