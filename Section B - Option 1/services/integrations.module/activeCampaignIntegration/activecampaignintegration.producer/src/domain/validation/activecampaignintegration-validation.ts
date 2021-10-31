import { ActiveCampaignIntegrationResponse } from '../../../../activecampaignintegration.dto/src/responses/activecampaignintegration-response';
import { ResponseStatus } from '../../../../activecampaignintegration.dto/src/responses/response-status';
import { ActiveCampaignIntegrationEvent } from '../../../../activecampaignintegration.dto/src';
import { ActiveCampaignIntegrationDataModel } from '../../domain/models/activecampaignintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class ActiveCampaignIntegrationValidation {
    async validate(event: ActiveCampaignIntegrationEvent<ActiveCampaignIntegrationDataModel>): Promise<ActiveCampaignIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            let response: ActiveCampaignIntegrationResponse;
            if (!event) {
                return new ActiveCampaignIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if(!event?.data?.firstName || event?.data?.firstName === '') {
                    valid = false;
                    returnMessage += '\nFirst name cannot be null or empty'
                }

                if(!event?.data?.lastName || event?.data?.lastName === '') {
                    valid = false;
                    returnMessage += '\Last name cannot be null or empty'
                }

                if(!event?.data?.email || event?.data?.email === '') {
                    valid = false;
                    returnMessage += '\nEmail address cannot be null or empty'
                }

                if(!event?.data?.phone || event?.data?.phone === '') {
                    valid = false;
                    returnMessage += '\nTelephone number cannot be null or empty'
                }

                if(!event?.data?.organizationId || event?.data?.organizationId === '') {
                    valid = false;
                    returnMessage += '\nOrganization ID cannot be null or empty'
                }
            }

            if (!valid) {
                response = new ActiveCampaignIntegrationResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new ActiveCampaignIntegrationResponse(
                event?.id?.toHexString(),
                'Event data is valid',
                ResponseStatus.success,
                200,
                {}
            );

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
