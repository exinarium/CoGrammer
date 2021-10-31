import { ActiveCampaignIntegrationRepository } from '../repositories/activecampaignintegration-repository';
import { ActiveCampaignIntegrationDataModel } from '../models/activecampaignintegration-datamodel';
import { ActiveCampaignIntegrationResponse, ResponseStatus, ActiveCampaignIntegrationMessage } from '../../../../activecampaignintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';

export class ActiveCampaignIntegrationAggregate {
    private repository: ActiveCampaignIntegrationRepository;

    constructor(repository: ActiveCampaignIntegrationRepository) {
        this.repository = repository;
    }

    async doAsync(message: ActiveCampaignIntegrationMessage<ActiveCampaignIntegrationDataModel>): Promise<ActiveCampaignIntegrationResponse> {
        try {
            if (message.data) {
                const result = await this.repository.createContactAsync(message);

                message.id = new ObjectID(message.id);

                if (result) {
                    const response = new ActiveCampaignIntegrationResponse(
                        message?.id?.toHexString(),
                        'Contact create success',
                        ResponseStatus.success,
                        200,
                        { result }
                    );

                    return response;
                } else {
                    const response = new ActiveCampaignIntegrationResponse(
                        message?.id?.toHexString(),
                        'Contact create failure',
                        ResponseStatus.failure,
                        400,
                        { result }
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new ActiveCampaignIntegrationResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ActiveCampaignIntegration consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
