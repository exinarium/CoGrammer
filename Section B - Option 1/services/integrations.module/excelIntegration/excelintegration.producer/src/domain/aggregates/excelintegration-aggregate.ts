import { ExcelIntegrationResponse, ExcelIntegrationEvent, ResponseStatus } from '../../../../excelintegration.dto/src';
import { ExcelIntegrationDataModel } from '../models/excelintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ExcelIntegrationMapping } from '../mapping/excelintegration-mapping';
import { ExcelIntegrationValidation } from '../validation/excelintegration-validation';
import { ExcelIntegrationMessageBus } from '../messageBus/excelintegration-message-bus';

export class ExcelIntegrationAggregate {
    constructor(
        private mapping: ExcelIntegrationMapping,
        private messageBus: ExcelIntegrationMessageBus,
        private validator: ExcelIntegrationValidation
    ) { }

    async doAsync(event: ExcelIntegrationEvent<ExcelIntegrationDataModel>): Promise<ExcelIntegrationResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);
                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new ExcelIntegrationResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ExcelIntegrationProducer producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
