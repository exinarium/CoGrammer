import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { OrganizationRepository } from '../repositories/organization-repository';
import { OrganizationValidation } from '../validation/organization-validation';
import { OrganizationMapping } from '../mapping/organization-mapping';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';

export class OrganizationAggregate {
    constructor(
        private repository: OrganizationRepository,
        private validation: OrganizationValidation,
        private mapper: OrganizationMapping
    ) { }

    async createAsync(request: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateCreate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const model = await this.mapper.mapWebhookToModel(request);
            const resultModel = await this.repository.createAsync(model, request.name);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'Organization create request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Organization create request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in Organization API';
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

            const resultModel = await this.repository.updateAsync(model, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'Organization update request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Organization update request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing update aggregation logic in Organization API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async deleteAsync(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            const validationResponse = await this.validation.validateDelete(requestId, organizationId, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.deleteAsync(organizationId, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'Organization delete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Organization delete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing delete aggregation logic in Organization API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async undeleteAsync(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            const validationResponse = await this.validation.validateUndelete(requestId, organizationId, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.undeleteAsync(organizationId, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'Organization undelete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Organization undelete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing undelete aggregation logic in Organization API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async lookupAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateLookup(id, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.requestId = requestId;
                return validationResponse;
            }

            const resultModel = await this.repository.lookupAsync(user);
            const result = await this.mapper.mapToModel(resultModel);

            if (result) {
                const response = {
                    responseId: requestId,
                    message: 'Organization lookup request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: result,
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
            const ERROR_MESSAGE = 'Error occurred while executing lookup aggregation logic in Organization API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
