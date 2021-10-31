import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { UserRepository } from '../repositories/user-repository';
import { UserValidation } from '../validation/user-validation';
import { UserMapping } from '../mapping/user-mapping';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID, ObjectId } from 'mongodb';
import { EmailProducer } from 'covidscreener-email/dist'
import { EmailEvent } from 'covidscreener-email/dist/email.dto/src';

export class UserAggregate {
    constructor(private repository: UserRepository, private validation: UserValidation, private mapper: UserMapping) { }

    async createAsync(request: any, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateCreate(request, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.responseId = requestId;
                return validationResponse;
            }

            const model = await this.mapper.mapToModel(request);
            model.organizationId = new ObjectId(user.organization._id);
            model.userId = new ObjectId(user._id);
            model.version = 1;

            const resultModel = await this.repository.createAsync(model, user);

            if (resultModel) {

                new EmailProducer().produceAsync({
                    eventName: 'EmailEvent',
                    id: new ObjectID(),
                    producedAt: new Date(),
                    version: 1,
                    data: {
                        to: [resultModel.email],
                        from: 'support@creativ360.com',
                        subject: 'You have been loaded to the 2020Screener Application!',
                        message: '<b>A new account has been created for you on the 2020Screener application.</b><br /><br />Please follow the link ' +
                            'to create your password and confirm your email address. Please note that this link is only usable one time:<br /><br />' +
                            `https://2020screener.com/#/verify/${resultModel.verifiedCode}` +
                            '<br /><br />Kind regards,<br />The Creativ360 team',
                        cc: [],
                        attachments: []
                    },
                    produceMessage: true

                })

                const response = {
                    responseId: requestId,
                    message: 'User create request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'User create request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async updateAsync(request: any, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateUpdate(request, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const model = await this.mapper.mapToModel(request);
            model.organizationId = new ObjectId(user.organization._id);
            model.userId = new ObjectId(user._id);

            if(!user.isAdminUser) {
                model.isAdminUser = false;
            }

            const resultModel = await this.repository.updateAsync(model, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'User update request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'User update request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async deleteAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateDelete(id, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.deleteAsync(new ObjectID(id), user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'User delete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'User delete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing delete aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async undeleteAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateUndelete(id, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.undeleteAsync(new ObjectID(id), user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'User undelete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'User undelete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing undelete aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async lookupAsync(
        id: string,
        searchString: string,
        start: number,
        limit: number,
        user: any,
        requestId: string
    ): Promise<any> {
        try {
            const validationResponse = await this.validation.validateLookup(id, searchString, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.lookupAsync(
                id ? new ObjectID(id) : null,
                searchString,
                start,
                limit,
                user
            );
            const results: any[] = [];

            resultModel.forEach((element) => {
                results.push(this.mapper.mapToModel(element));
            });

            if (results.length > 0) {
                const response = {
                    responseId: requestId,
                    message: 'User lookup request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: results,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'No data could be retrieved',
                    status: ResponseStatus.failure,
                    code: StatusCode.noData,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing lookup aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async forgotPasswordAsync(requestId: ObjectID, forgotPasswordCode: string, newPassword: string, confirmPassword: string, email: string): Promise<any> {

        try {
            const validationResponse = await this.validation.validateForgotPassword(requestId, forgotPasswordCode, newPassword, confirmPassword, email);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            if (email && email !== '') {
                const result = await this.repository.sendForgotPasswordAsync(email);

                if (result) {
                    new EmailProducer().produceAsync({
                        eventName: 'EmailEvent',
                        id: new ObjectID(),
                        producedAt: new Date(),
                        version: 1,
                        data: {
                            to: [email],
                            from: 'support@creativ360.com',
                            subject: 'New forgot password request for 2020Screener!',
                            message: '<b>A new forgot password request has been logged on the 2020Screener for your account</b><br /><br />Please follow the link ' +
                                'to reset your password. Please note that this link is only usable one time:<br /><br />' +
                                `https://2020screener.com/#/forgot-password/${result.forgotPasswordCode}` +
                                '<br /><br />Kind regards,<br />The Creativ360 team',
                            cc: [],
                            attachments: []
                        },
                        produceMessage: true
                    });

                    const response = {
                        responseId: requestId,
                        message: 'Password reset link sent successfully',
                        status: ResponseStatus.success,
                        code: StatusCode.ok
                    };

                    return response;
                }
                else {
                    const response = {
                        responseId: requestId,
                        message: 'Send reset link failed',
                        status: ResponseStatus.failure,
                        code: StatusCode.internalServerError,
                    };

                    return response;
                }
            }
            else {

                const result = await this.repository.forgotPasswordAsync(
                    requestId,
                    forgotPasswordCode,
                    newPassword,
                    confirmPassword
                );

                if (result) {
                    const response = {
                        responseId: requestId,
                        message: 'Password reset successfully',
                        status: ResponseStatus.success,
                        code: StatusCode.ok
                    };

                    return response;
                } else {
                    const response = {
                        responseId: requestId,
                        message: 'Password reset failed',
                        status: ResponseStatus.failure,
                        code: StatusCode.internalServerError,
                    };

                    return response;
                }
            }

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing forgot password aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async verifyAccountAsync(requestId: ObjectID, verifyCode: string, newPassword: string, confirmPassword: string): Promise<any> {

        try {
            const validationResponse = await this.validation.validateVerifyAccount(requestId, verifyCode, newPassword, confirmPassword);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const result = await this.repository.verifyAccountAsync(
                requestId,
                verifyCode,
                newPassword,
                confirmPassword
            );

            if (result) {
                const response = {
                    responseId: requestId,
                    message: 'Account verified successfully',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Account verification failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing verify aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async updatePasswordAsync(requestId: ObjectID, newPassword: string, confirmPassword: string, currentPassword: string, user: any): Promise<any> {

        try {
            const validationResponse = await this.validation.validateUpdatePassword(requestId?.toHexString(), newPassword, confirmPassword, currentPassword, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const result = await this.repository.updatePasswordAsync(
                newPassword,
                confirmPassword,
                currentPassword,
                user
            );

            if (result) {
                const response = {
                    responseId: requestId,
                    message: 'User password changed successfully',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'User password change failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing password change aggregation logic in User API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
