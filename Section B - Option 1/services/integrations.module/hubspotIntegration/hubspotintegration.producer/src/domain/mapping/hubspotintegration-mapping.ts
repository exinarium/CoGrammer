import { HubspotIntegrationMessage, HubspotIntegrationEvent, HubspotIntegrationResponse } from '../../../../hubspotintegration.dto/src';
import { HubspotIntegrationDataModel } from '../../domain/models/hubspotintegration-datamodel';

export class HubspotIntegrationMapping {
    async map(event: HubspotIntegrationEvent<HubspotIntegrationDataModel>): Promise<HubspotIntegrationMessage<HubspotIntegrationDataModel>> {

        const hubspotintegrationMessage = new HubspotIntegrationMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return hubspotintegrationMessage;
    }
}
