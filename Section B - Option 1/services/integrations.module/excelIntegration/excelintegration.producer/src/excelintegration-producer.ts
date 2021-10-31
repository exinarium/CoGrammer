import { ExcelIntegrationEvent } from '../../excelintegration.dto/src/events/excelintegration-event';
import { ExcelIntegrationResponse } from '../../excelintegration.dto/src/responses/excelintegration-response';
import { ExcelIntegrationAggregate } from './domain/aggregates/excelintegration-aggregate';
import { ExcelIntegrationDataModel } from './domain/models/excelintegration-datamodel';
import Configuration from './configuration.json';
import { ExcelIntegrationValidation } from './domain/validation/excelintegration-validation';
import { ExcelIntegrationMapping } from './domain/mapping/excelintegration-mapping';
import { ExcelIntegrationMessageBus } from './domain/messageBus/excelintegration-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class ExcelIntegrationProducer{
    private aggregate: ExcelIntegrationAggregate;

    constructor() {
        const validation = new ExcelIntegrationValidation();
        const mapping = new ExcelIntegrationMapping();
        const messageBus = new ExcelIntegrationMessageBus(Configuration.messageBus.connectionString, Configuration.messageBus.topic);
        this.aggregate = new ExcelIntegrationAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: ExcelIntegrationEvent<ExcelIntegrationDataModel>): Promise<ExcelIntegrationResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for ExcelIntegration';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
