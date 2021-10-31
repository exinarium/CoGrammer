import { HubspotIntegrationRepository } from '../repositories/hubspotintegration-repository';
import { HubspotIntegrationDataModel } from '../models/hubspotintegration-datamodel';
import { HubspotIntegrationResponse, ResponseStatus, HubspotIntegrationMessage } from '../../../../hubspotintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';

export class HubspotIntegrationAggregate {
    private repository: HubspotIntegrationRepository;

    constructor(repository: HubspotIntegrationRepository) {
        this.repository = repository;
    }

    async doAsync(message: HubspotIntegrationMessage<HubspotIntegrationDataModel>): Promise<HubspotIntegrationResponse> {
        try {
            if (message.data) {
                const result = await this.repository.createContactAsync(message);

                message.id = new ObjectID(message.id);

                if (result) {
                    const response = new HubspotIntegrationResponse(
                        message?.id?.toHexString(),
                        'HubspotIntegration request success',
                        ResponseStatus.success,
                        200,
                        { result }
                    );

                    return response;
                } else {
                    const response = new HubspotIntegrationResponse(
                        message?.id?.toHexString(),
                        'HubspotIntegration request failure',
                        ResponseStatus.failure,
                        400,
                        { result }
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new HubspotIntegrationResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in HubspotIntegration consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
