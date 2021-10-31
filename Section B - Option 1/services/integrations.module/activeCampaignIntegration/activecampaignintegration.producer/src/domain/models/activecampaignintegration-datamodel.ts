export class ActiveCampaignIntegrationDataModel {

    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public organizationId: string,
        public activeCampaignTagName: string
    ) { }
}