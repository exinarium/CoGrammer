import { HubspotIntegrationResponse } from '../../../../hubspotintegration.dto/src/responses/hubspotintegration-response';
import { ResponseStatus } from '../../../../hubspotintegration.dto/src/responses/response-status';
import { HubspotIntegrationEvent } from '../../../../hubspotintegration.dto/src';
import { HubspotIntegrationDataModel } from '../../domain/models/hubspotintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class HubspotIntegrationValidation {
    async validate(event: HubspotIntegrationEvent<HubspotIntegrationDataModel>): Promise<HubspotIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            let response: HubspotIntegrationResponse;
            if (!event) {
                return new HubspotIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
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
                response = new HubspotIntegrationResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new HubspotIntegrationResponse(
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
