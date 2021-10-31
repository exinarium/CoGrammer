import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { YourServiceRepository } from '../repositories/yourservice-repository';
import { YourServiceValidation } from '../validation/yourservice-validation';
import { YourServiceMapping } from '../mapping/yourservice-mapping';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID } from 'mongodb';

export class YourServiceAggregate {
    constructor(
        private repository: YourServiceRepository,
        private validation: YourServiceValidation,
        private mapper: YourServiceMapping
    ) {}

    async createAsync(request: any, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateCreate(request, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.responseId = requestId;
                return validationResponse;
            }

            const model = await this.mapper.mapToModel(request);
            model.organizationId = new ObjectID(user.organization._id);
            model.userId = new ObjectID(user._id);

            const resultModel = await this.repository.createAsync(model, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'YourService create request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'YourService create request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in YourService API';
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
            model.organizationId = new ObjectID(user.organization._id);
            model.userId = new ObjectID(user._id);

            const resultModel = await this.repository.updateAsync(model, user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'YourService update request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                    data: resultModel,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'YourService update request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in YourService API';
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
                    message: 'YourService delete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'YourService delete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing delete aggregation logic in YourService API';
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
                    message: 'YourService undelete request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok,
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'YourService undelete request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing undelete aggregation logic in YourService API';
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
                    message: 'YourService lookup request success',
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
            const ERROR_MESSAGE = 'Error occurred while executing lookup aggregation logic in YourService API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
