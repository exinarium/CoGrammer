import { EmailRequest, EmailEvent } from '../../../../email.dto/src';
import { EmailDataModel } from '../models/email-datamodel';
import { ObjectId } from 'mongodb';
import { Config } from '../config/config';

export class EmailMapping {

    constructor(private config: Config) { }

    async mapToSupportEvent(request: EmailRequest): Promise<EmailEvent<EmailDataModel>> {
        const emailEvent = new EmailEvent(
            new ObjectId(),
            new Date(),
            'EmailEvent',
            new EmailDataModel(
                request.subject,
                request.from,
                [
                    this.config.supportEmail
                ],
                [],
                `Good day!<br><br>` +
                `A new message has been sent through the 2020 Screener Contact page:<br><br>` +
                `<table>` +
                `<tr><td>Name:</td><td>${request.name}</td></tr>` +
                `<tr><td>Email:</td><td>${request.from}</td></tr>` +
                `<tr><td>Message:</td><td>${request.message}</td></tr>` +
                `</table><br><br>` +
                `Kind regards<br>The 2020 Screener Team`,
                []
            ),
            1,
            true
        );

        return emailEvent;
    }

    async mapToClientEvent(request: EmailRequest): Promise<EmailEvent<EmailDataModel>> {
        const emailEvent = new EmailEvent(
            new ObjectId(),
            new Date(),
            'EmailEvent',
            new EmailDataModel(
                request.subject,
                this.config.supportEmail,
                [
                    request.from
                ],
                [],
                `Good day!<br><br>Thank you for your query. It has been received and will be processed within the next 48 hours.<br><br>` +
                `Please see below a copy of your message for your records.<br><br>` +
                `<table>` +
                `<tr><td>Name:</td><td>${request.name}</td></tr>` +
                `<tr><td>Email:</td><td>${request.from}</td></tr>` +
                `<tr><td>Message:</td><td>${request.message}</td></tr>` +
                `</table><br><br>` +
                `Kind regards<br>The 2020 Screener Team`,
                []
            ),
            1,
            true
        );

        return emailEvent;
    }
}
