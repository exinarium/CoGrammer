import { EmailMessage, EmailEvent, EmailResponse } from '../../../dist/email.dto/src';
import { EmailDataModel } from '../../domain/models/email-datamodel';

export class EmailMapping {
    async map(event: EmailEvent<EmailDataModel>): Promise<EmailMessage<EmailDataModel>> {

        const emailMessage = new EmailMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return emailMessage;
    }
}
