import { ExcelIntegrationRequest, ExcelIntegrationResponse, ResponseStatus } from '../../../../excelintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';
import { userInfo } from 'os';

export class ExcelIntegrationValidation {
    async validate(request: ExcelIntegrationRequest, user: any): Promise<ExcelIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new ExcelIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {

                if (!request?.id || !ObjectID.isValid(request.id)) {
                    valid = false;
                    returnMessage += "\nThe request ID is invalid";
                }

                if (!request?.emailAddress || request?.emailAddress === '' || request?.emailAddress !== user.email) {
                    valid = false;
                    returnMessage += "\nYou need to provide a valid email address";
                }

                if (!request?.exportType || request?.exportType <= 0 || request?.exportType > 3) {
                    valid = false;
                    returnMessage += "\nYou need to provide a valid export type";
                }
            }

            if (!valid) {
                return new ExcelIntegrationResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new ExcelIntegrationResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
