import { GoogleSheetIntegrationResponse } from '../../../../googlesheetintegration.dto/src/responses/googlesheetintegration-response';
import { ResponseStatus } from '../../../../googlesheetintegration.dto/src/responses/response-status';
import { GoogleSheetIntegrationEvent } from '../../../../googlesheetintegration.dto/src';
import { GoogleSheetIntegrationDataModel } from '../../domain/models/googlesheetintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class GoogleSheetIntegrationValidation {
    async validate(event: GoogleSheetIntegrationEvent<GoogleSheetIntegrationDataModel>): Promise<GoogleSheetIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            let response: GoogleSheetIntegrationResponse;
            if (!event) {
                return new GoogleSheetIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if(!event.data) {
                    valid = false;
                    returnMessage += '\nThe event contains no data';
                }
            }

            if (!valid) {
                response = new GoogleSheetIntegrationResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new GoogleSheetIntegrationResponse(
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
