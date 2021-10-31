import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID } from 'mongodb';

export class YourServiceValidation {
    async validateCreate(request: any, user: any): Promise<any> {
        try {
            const valid = true;
            const returnMessage = '';

            if (!request || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'Request and User Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                /**
                 * Add your special validation here
                 */
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
                if (!request._id || request._id === '' || !ObjectID.isValid(request._id)) {
                    valid = false;
                    returnMessage = '\n\rThe _id property is not valid';
                }

                /**
                 * Add your special validation here
                 */
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

    async validateDelete(id: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || id === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'ID and User cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                if (!ObjectID.isValid(id)) {
                    valid = false;
                    returnMessage = '\n\rThe _id property is not valid';
                }

                /**
                 * Add your special validation here
                 */
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

    async validateUndelete(id: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || id === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'ID and User cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                if (!ObjectID.isValid(id)) {
                    valid = false;
                    returnMessage = '\n\rThe _id property is not valid';
                }

                /**
                 * Add your special validation here
                 */
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

    async validateLookup(id: string, searchString: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || id === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'ID and Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                if (id && id !== '') {
                    if (!ObjectID.isValid(id)) {
                        valid = false;
                        returnMessage = '\n\rThe _id property is not valid';
                    }
                }

                /**
                 * Add your special validation here
                 */
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
