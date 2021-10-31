import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { PayfastRepository } from '../repositories/payfast-repository';
import { PayfastValidation } from '../validation/payfast-validation';
import { PayfastMapping } from '../mapping/payfast-mapping';
import { ResponseStatus } from '../enums/response-status';
import { StatusCode } from '../enums/status-code';
import { ObjectID } from 'mongodb';

export class PayfastAggregate {
    constructor(
        private repository: PayfastRepository,
        private validation: PayfastValidation,
        private mapper: PayfastMapping
    ) {}

    async cancelAsync(request: any, user: any, requestId: string): Promise<any> {
        try {
            const validationResponse = await this.validation.validateCancel(request, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.responseId = requestId;
                return validationResponse;
            }

            const model = await this.mapper.mapToModel(request);
            model.organizationId = new ObjectID(user.organization._id);
            model.userId = new ObjectID(user._id);

            const resultModel = await this.repository.cancelAsync(user);

            if (resultModel) {
                const response = {
                    responseId: requestId,
                    message: 'Payfast cancel request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Payfast cancel request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing cancel aggregation logic in Payfast API';
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
                    message: 'Payfast update request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: requestId,
                    message: 'Payfast update request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing create aggregation logic in Payfast API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async updateByNotificationAsync(organizationId: string, paymentPlan: number, paymentDate: Date, paymentStatus: boolean, subscriptionToken: string): Promise<any> {
        try {

            const resultModel = await this.repository.updateByNotificationAsync(new ObjectID(organizationId), paymentPlan, paymentDate, paymentStatus, subscriptionToken);

            if (resultModel) {
                const response = {
                    responseId: organizationId,
                    message: 'Payfast update request success',
                    status: ResponseStatus.success,
                    code: StatusCode.ok
                };

                return response;
            } else {
                const response = {
                    responseId: organizationId,
                    message: 'Payfast update request failed',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing update by notification aggregation logic in Payfast API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
