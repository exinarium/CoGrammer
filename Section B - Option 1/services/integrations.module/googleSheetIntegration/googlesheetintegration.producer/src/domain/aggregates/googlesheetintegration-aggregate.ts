import { GoogleSheetIntegrationResponse, GoogleSheetIntegrationEvent, ResponseStatus } from '../../../../googlesheetintegration.dto/src';
import { GoogleSheetIntegrationDataModel } from '../models/googlesheetintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { GoogleSheetIntegrationMapping } from '../mapping/googlesheetintegration-mapping';
import { GoogleSheetIntegrationValidation } from '../validation/googlesheetintegration-validation';
import { GoogleSheetIntegrationMessageBus } from '../messageBus/googlesheetintegration-message-bus';

export class GoogleSheetIntegrationAggregate {
    constructor(
        private mapping: GoogleSheetIntegrationMapping,
        private messageBus: GoogleSheetIntegrationMessageBus,
        private validator: GoogleSheetIntegrationValidation
    ) { }

    async doAsync(event: GoogleSheetIntegrationEvent<GoogleSheetIntegrationDataModel>): Promise<GoogleSheetIntegrationResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);
                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new GoogleSheetIntegrationResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in GoogleSheetIntegrationProducer producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
