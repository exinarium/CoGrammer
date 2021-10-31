import { EmailMapping } from '../mapping/email-mapping';
import { EmailResponse, EmailEvent, ResponseStatus } from '../../../dist/email.dto/src/';
import { EmailDataModel } from '../models/email-datamodel';
import { EmailMessageBus } from '../messageBus/email-message-bus';
import { EmailValidation } from '../validation/email-validation';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src/events/auditlog-event';
import { ObjectID } from 'mongodb';

export class EmailAggregate {
    constructor(
        private mapping: EmailMapping,
        private messageBus: EmailMessageBus,
        private validator: EmailValidation
    ) { }

    async doAsync(event: EmailEvent<EmailDataModel>): Promise<EmailResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);

                const auditEvent: AuditLogEvent<EmailDataModel> = {
                    objectId: new ObjectID(),
                    eventName: 'EmailCreatedEvent',
                    version: 1,
                    data: event.data,
                    producedAt: event.producedAt,
                    module: 4,
                };

                await new AuditLogProducer().produceAsync(auditEvent);
                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new EmailResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in Email producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
