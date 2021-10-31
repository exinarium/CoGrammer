import { YourServiceResponse, ResponseStatus, YourServiceRequest } from '../../../../yourservice.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { YourServiceProducer } from '../../../../yourservice.producer/dist/yourservice.producer/src';
import { YourServiceValidation } from '../validation/yourservice-validation';
import { YourServiceMapping } from '../mapping/yourservice-mapping';

export class YourServiceAggregate {
    constructor(
        private validation: YourServiceValidation,
        private mapper: YourServiceMapping
    ) {}

    async doAsync(request: YourServiceRequest): Promise<YourServiceResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const event = await this.mapper.mapToEvent(request);
            const resultEvent = await new YourServiceProducer().produceAsync(event);

            if (resultEvent) {
                const response = new YourServiceResponse(
                    request.id,
                    'YourService request success',
                    ResponseStatus.success,
                    200,
                    { resultEvent }
                );

                return response;
            } else {
                const response = new YourServiceResponse(
                    request.id,
                    'YourService request failure',
                    ResponseStatus.failure,
                    500,
                    { resultEvent }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in YourService API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
