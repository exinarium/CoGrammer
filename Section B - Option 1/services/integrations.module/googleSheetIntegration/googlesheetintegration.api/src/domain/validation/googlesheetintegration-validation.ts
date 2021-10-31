import { GoogleSheetIntegrationRequest, GoogleSheetIntegrationResponse, ResponseStatus } from '../../../../googlesheetintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class GoogleSheetIntegrationValidation {
    async validate(request: GoogleSheetIntegrationRequest): Promise<GoogleSheetIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new GoogleSheetIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {

                if(!request.accessCode || request.accessCode === '') {
                    valid = false;
                    returnMessage += '\nYou need to provide a valid Google Access Token';
                }
            }

            if (!valid) {
                return new GoogleSheetIntegrationResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new GoogleSheetIntegrationResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
