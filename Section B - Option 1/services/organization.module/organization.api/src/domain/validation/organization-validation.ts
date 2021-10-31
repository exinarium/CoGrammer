import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { Role } from 'covidscreener-authentication-jwt/dist/domain/models/user-role';
import { ObjectID } from 'mongodb';

export class OrganizationValidation {

    async validateCreate(request: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return {
                    responseId: '',
                    message: 'Request cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {
                if (!request.requestId || request.requestId === '') {
                    returnMessage += '\nThe requestId needs to be supplied';
                    valid = false;
                }

                if (!request.name || request.name === '') {
                    returnMessage += '\nThe contact name needs to be supplied';
                    valid = false;
                }

                if (!request.email || request.email === '') {
                    returnMessage += '\nThe contact email address needs to be supplied';
                    valid = false;
                }

                if (!request.companyName || request.companyName === '') {
                    returnMessage += '\nThe company name needs to be supplied';
                    valid = false;
                }

                if (!request.country || request.country === '') {
                    returnMessage += '\nThe organization\`s county of origin to be supplied';
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
            const ERROR_MESSAGE = 'Error during update request validation';
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
                if (!request.requestId || request.requestId === '') {
                    returnMessage += '\nThe requestId needs to be supplied';
                    valid = false;
                }

                if (!request._id || request._id === '' || !ObjectID.isValid(request._id)) {
                    valid = false;
                    returnMessage = '\n\rThe _id property is not valid';
                }

                if (!request.organizationName || request.organizationName === '') {
                    returnMessage += '\nOrganization name cannot be null or empty';
                    valid = false;
                }

                if (!request.organizationCountryCode || request.organizationCountryCode === '') {
                    returnMessage += '\nOrganization country code cannot be null or empty';
                    valid = false;
                }

                if (!request.mainUserEmail || request.mainUserEmail === '') {
                    returnMessage += '\nThe main user email address cannot be null or empty';
                    valid = false;
                }

                if (!request.version || request.version <= 0) {
                    returnMessage += '\nThe object version is invalid';
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
            const ERROR_MESSAGE = 'Error during update request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateDelete(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!requestId || requestId === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'Request ID and User Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {

                if (!organizationId || organizationId === '' || !ObjectID.isValid(organizationId)) {
                    valid = false;
                    returnMessage = '\n\rThe organizationId property is not valid';
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
            const ERROR_MESSAGE = 'Error during delete request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateUndelete(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!requestId || requestId === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'Request ID and User Object cannot be empty',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else {

                if (!organizationId || organizationId === '' || !ObjectID.isValid(organizationId)) {
                    valid = false;
                    returnMessage = '\n\rThe organizationId property is not valid';
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
            const ERROR_MESSAGE = 'Error during undelete request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateLookup(id: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || id === '' || !user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'ID and user object cannot be empty',
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
            const ERROR_MESSAGE = 'Error during lookup request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
