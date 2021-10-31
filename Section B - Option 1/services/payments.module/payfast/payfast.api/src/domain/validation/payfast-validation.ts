import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID } from 'mongodb';

export class PayfastValidation {
    async validateCancel(request: any, user: any): Promise<any> {
        try {

            let returnMessage = '';
            let valid = true;

            if (!request || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'Request and User Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {

                if (!request.requestId || request.requestId === '' || !ObjectID.isValid(request.requestId)) {
                    valid = false;
                    returnMessage = '\n\rThe requestId property is not valid';
                }
            }

            if (!valid) {
                return {
                    responseId: '',
                    message: returnMessage,
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            }

            const response = {
                responseId: '',
                message: 'Validation successful',
                status: ResponseStatus.success,
                code: StatusCode.ok,
            };

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during create request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateUpdate(request: any, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'Request and User Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                if (!request.requestId || request.requestId === '' || !ObjectID.isValid(request.requestId)) {
                    valid = false;
                    returnMessage = '\n\rThe requestId property is not valid';
                }

                if (request.amount < 0) {
                    returnMessage += '\nPlease provide the amount in ZAR CENTS for the subscription to be billed',
                        valid = false;
                }

                if (request.planNumber < 0) {
                    returnMessage += '\nPlease provide a valid plan number',
                        valid = false;
                }
            }

            if (!valid) {
                return {
                    responseId: '',
                    message: returnMessage,
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            }

            const response = {
                responseId: '',
                message: 'Validation successful',
                status: ResponseStatus.success,
                code: StatusCode.ok,
            };

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during create request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
