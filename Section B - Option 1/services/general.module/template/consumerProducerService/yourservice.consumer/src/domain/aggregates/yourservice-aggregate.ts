import { YourServiceRepository } from '../repositories/yourservice-repository';
import { YourServiceDataModel } from '../models/yourservice-datamodel';
import { YourServiceResponse, ResponseStatus, YourServiceMessage } from '../../../../yourservice.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';

export class YourServiceAggregate {
    private repository: YourServiceRepository;

    constructor(repository: YourServiceRepository) {
        this.repository = repository;
    }

    async doAsync(message: YourServiceMessage<YourServiceDataModel>): Promise<YourServiceResponse> {
        try {
            if (message.data) {
                const result = await this.repository.doAsync(message);

                message.id = new ObjectID(message.id);

                if (result) {
                    const response = new YourServiceResponse(
                        message?.id?.toHexString(),
                        'YourService request success',
                        ResponseStatus.success,
                        200,
                        { result }
                    );

                    return response;
                } else {
                    const response = new YourServiceResponse(
                        message?.id?.toHexString(),
                        'YourService request failure',
                        ResponseStatus.failure,
                        400,
                        { result }
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new YourServiceResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in YourService consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
