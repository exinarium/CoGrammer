import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { Role } from 'covidscreener-authentication-jwt/dist/domain/models/user-role';
import { ObjectID } from 'mongodb';

export class CandidateInteractionValidation {
    async validateCreate(request: any, user: any): Promise<any> {
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
                    returnMessage += '\nRequest ID cannot be null or empty';
                    valid = false;
                }

                if (!request.profileId || request.profileId === '') {
                    returnMessage += '\nAll interactions must be linked to a profile';
                    valid = false;
                }

                if (!request.meetingAddress || request.meetingAddress === '') {
                    returnMessage += 'The meeting address cannot be null or empty';
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

                if (!request.requestId || request.requestId === '') {
                    returnMessage += '\nRequest ID cannot be null or empty';
                    valid = false;
                }

                if (!request.profileId || request.profileId === '') {
                    returnMessage += '\nAll interactions must be linked to a profile';
                    valid = false;
                }

                if (!request.clientImage || request.clientImage === '') {
                    returnMessage += '\nClient image cannot be null or empty';
                    valid = false;
                }

                if (!request.meetingAddress || request.meetingAddress === '') {
                    returnMessage += 'The meeting address cannot be null or empty';
                    valid = false;
                }

                if (!request.temperature || request.temperature <= 0) {
                    returnMessage += 'The temperature needs to be added';
                    valid = false;
                }

                if (!request.version || request.version <= 0) {
                    returnMessage += '\nThe version value needs to be supplied and be greater than 0';
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

    async validateLookup(id: string, searchString: string, user: any, candidateProfileId: string): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!candidateProfileId || candidateProfileId === '' || !ObjectID.isValid(candidateProfileId)) {
                return {
                    responseId: '',
                    message: 'All interactions must be linked to a profile ID',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            } else if (!user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'User object cannot be empty',
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
            const ERROR_MESSAGE = 'Error during create request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
