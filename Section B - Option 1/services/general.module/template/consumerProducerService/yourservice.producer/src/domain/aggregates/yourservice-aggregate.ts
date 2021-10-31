import { YourServiceResponse, YourServiceEvent, ResponseStatus } from '../../../../yourservice.dto/src';
import { YourServiceDataModel } from '../models/yourservice-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { YourServiceMapping } from '../mapping/yourservice-mapping';
import { YourServiceValidation } from '../validation/yourservice-validation';
import { YourServiceMessageBus } from '../messageBus/yourservice-message-bus';

export class YourServiceAggregate {
    constructor(
        private mapping: YourServiceMapping,
        private messageBus: YourServiceMessageBus,
        private validator: YourServiceValidation
    ) { }

    async doAsync(event: YourServiceEvent<YourServiceDataModel>): Promise<YourServiceResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);

                /** If produce audit trail CQRS */
                /* const auditEvent: AuditLogEvent<YourServiceDataModel> = {
                    objectId: new ObjectID(),
                    eventName: 'YourServiceCreatedEvent',
                    version: 1,
                    data: event.data,
                    producedAt: event.producedAt,
                    module: 4,
                };

                await new AuditLogProducer().produceAsync(auditEvent);*/

                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new YourServiceResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in YourServiceProducer producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
