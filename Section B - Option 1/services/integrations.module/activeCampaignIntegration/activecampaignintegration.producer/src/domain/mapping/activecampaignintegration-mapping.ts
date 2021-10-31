import { ActiveCampaignIntegrationMessage, ActiveCampaignIntegrationEvent, ActiveCampaignIntegrationResponse } from '../../../../activecampaignintegration.dto/src';
import { ActiveCampaignIntegrationDataModel } from '../../domain/models/activecampaignintegration-datamodel';

export class ActiveCampaignIntegrationMapping {
    async map(event: ActiveCampaignIntegrationEvent<ActiveCampaignIntegrationDataModel>): Promise<ActiveCampaignIntegrationMessage<ActiveCampaignIntegrationDataModel>> {

        const activecampaignintegrationMessage = new ActiveCampaignIntegrationMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return activecampaignintegrationMessage;
    }
}
