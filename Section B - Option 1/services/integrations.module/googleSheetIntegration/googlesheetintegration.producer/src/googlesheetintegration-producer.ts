import { GoogleSheetIntegrationEvent } from '../../googlesheetintegration.dto/src/events/googlesheetintegration-event';
import { GoogleSheetIntegrationResponse } from '../../googlesheetintegration.dto/src/responses/googlesheetintegration-response';
import { GoogleSheetIntegrationAggregate } from './domain/aggregates/googlesheetintegration-aggregate';
import { GoogleSheetIntegrationDataModel } from './domain/models/googlesheetintegration-datamodel';
import Configuration from './configuration.json';
import { GoogleSheetIntegrationValidation } from './domain/validation/googlesheetintegration-validation';
import { GoogleSheetIntegrationMapping } from './domain/mapping/googlesheetintegration-mapping';
import { GoogleSheetIntegrationMessageBus } from './domain/messageBus/googlesheetintegration-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class GoogleSheetIntegrationProducer{
    private aggregate: GoogleSheetIntegrationAggregate;

    constructor() {
        const validation = new GoogleSheetIntegrationValidation();
        const mapping = new GoogleSheetIntegrationMapping();
        const messageBus = new GoogleSheetIntegrationMessageBus(Configuration.messageBus.connectionString, Configuration.messageBus.topic);
        this.aggregate = new GoogleSheetIntegrationAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: GoogleSheetIntegrationEvent<GoogleSheetIntegrationDataModel>): Promise<GoogleSheetIntegrationResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for GoogleSheetIntegration';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
