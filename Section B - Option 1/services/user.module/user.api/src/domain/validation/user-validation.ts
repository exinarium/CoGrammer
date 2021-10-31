import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID, ObjectId } from 'mongodb';

export class UserValidation {

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
                    returnMessage += '\nThe requestId cannot be null or empty';
                    valid = false;
                }

                if (!request.name || request.name === '') {
                    returnMessage += '\nThe user name cannot be null or empty';
                    valid = false;
                }

                if (!request.email || request.email === '') {
                    returnMessage += '\nThe user email is not valid';
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
                if (!request.requestId || request.requestId === '') {
                    returnMessage += '\nThe requestId cannot be null or empty';
                    valid = false;
                }

                if (!request._id || request._id === '' || !ObjectID.isValid(request._id)) {
                    valid = false;
                    returnMessage = '\n\rThe request _id property is not valid';
                }

                if (!request.name || request.name === '') {
                    returnMessage += '\nThe user name cannot be null or empty';
                    valid = false;
                }

                if (!request.email || request.email === '') {
                    returnMessage += '\nThe user email is not valid';
                    valid = false;
                }

                if (!request.version || request.version <= 0) {
                    returnMessage += '\nThe data version is invalid';
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

    async validateLookup(id: string, searchString: string, user: any): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!user || !user._id || user._id === '') {
                return {
                    responseId: '',
                    message: 'User Object cannot be empty',
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

    async validateVerifyAccount(id: ObjectID, verifyCode: string, newPassword: string, confirmPassword: string): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || !ObjectID.isValid(id)) {
                return {
                    responseId: '',
                    message: 'ReguestId cannot be empty or is not valid',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            }

            if (!verifyCode || verifyCode === '') {

                returnMessage += '\nThe verification code is not valid';
                valid = false;
            }

            if (!newPassword || newPassword === '') {

                returnMessage += '\nThe password is not valid';
                valid = false;
            }

            if (newPassword !== confirmPassword) {

                returnMessage += '\nThe passwords do not match';
                valid = false;
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
            const ERROR_MESSAGE = 'Error during verify account request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateForgotPassword(id: ObjectID, forgotPasswordCode: string, newPassword: string, confirmPassword: string, email: string): Promise<any> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!id || !ObjectID.isValid(id)) {
                return {
                    responseId: '',
                    message: 'ReguestId cannot be empty or is not valid',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                };
            }

            if (!email || email === '') {

                if (!forgotPasswordCode || forgotPasswordCode === '') {

                    returnMessage += '\nThe verification code is not valid';
                    valid = false;
                }

                if (!newPassword || newPassword === '') {

                    returnMessage += '\nThe password is not valid';
                    valid = false;
                }

                if (newPassword !== confirmPassword) {

                    returnMessage += '\nThe passwords do not match';
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
            const ERROR_MESSAGE = 'Error during verify account request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async validateUpdatePassword(id: string, newPassword: string, confirmPassword: string, currentPassword: string, user: any): Promise<any> {
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

                if(!currentPassword || currentPassword === '') {

                    valid = false;
                    returnMessage += '\nThe current password cannot be null or empty';
                }

                if(!newPassword || newPassword === '') {

                    valid = false;
                    returnMessage += '\nThe new password cannot be null or empty';
                }

                if(newPassword !== confirmPassword) {

                    valid = false;
                    returnMessage += '\nThe passwords do not match';
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
