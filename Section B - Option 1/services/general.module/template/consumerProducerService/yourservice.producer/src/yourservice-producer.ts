import { YourServiceEvent } from '../../yourservice.dto/src/events/yourservice-event';
import { YourServiceResponse } from '../../yourservice.dto/src/responses/yourservice-response';
import { YourServiceAggregate } from './domain/aggregates/yourservice-aggregate';
import { YourServiceDataModel } from './domain/models/yourservice-datamodel';
import Configuration from './configuration.json';
import { YourServiceValidation } from './domain/validation/yourservice-validation';
import { YourServiceMapping } from './domain/mapping/yourservice-mapping';
import { YourServiceMessageBus } from './domain/messageBus/yourservice-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class YourServiceProducer{
    private aggregate: YourServiceAggregate;

    constructor() {
        const validation = new YourServiceValidation();
        const mapping = new YourServiceMapping();
        const messageBus = new YourServiceMessageBus(Configuration.messageBus.connectionString, Configuration.messageBus.topic);
        this.aggregate = new YourServiceAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: YourServiceEvent<YourServiceDataModel>): Promise<YourServiceResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for YourService';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
