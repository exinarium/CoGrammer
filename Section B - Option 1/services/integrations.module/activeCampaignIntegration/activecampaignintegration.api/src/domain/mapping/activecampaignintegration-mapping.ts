import { ActiveCampaignIntegrationDataModel } from '../models/activecampaignintegration-datamodel';

export class ActiveCampaignIntegrationMapping {
    async mapToModel(result: any[]): Promise<ActiveCampaignIntegrationDataModel[]> {

        const list: ActiveCampaignIntegrationDataModel[] = [];

        if(result && result.length > 0) {

            result.forEach(element => {
                const model = new ActiveCampaignIntegrationDataModel(element.id, element.name);
                list.push(model);
            });
        }

        return list;
    }
}
