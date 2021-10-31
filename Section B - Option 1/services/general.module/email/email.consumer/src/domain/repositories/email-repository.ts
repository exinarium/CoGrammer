import { EmailDataModel } from '../models/email-datamodel';
import { EmailMessage } from '../../../../email.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import * as nodemailer from 'nodemailer';

export class EmailRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async doAsync(message: EmailMessage<EmailDataModel>): Promise<boolean> {

        try {

            if (message && message.data) {
                const transporter = nodemailer.createTransport({
                    service: this.config.emailConfig.service,
                    auth: {
                        user: this.config.emailConfig.user,
                        pass: this.config.emailConfig.password
                    }
                });

                const mailOptions: nodemailer.SendMailOptions = {
                    from: message?.data?.from,
                    subject: message?.data?.subject,
                    html: message?.data?.message
                };

                mailOptions.to = '';

                message?.data?.to?.forEach(element => {
                    mailOptions.to += element + ','
                });

                mailOptions.cc = '';

                message?.data?.cc?.forEach(element => {
                    mailOptions.cc += element + ','
                });

                message?.data?.attachments?.forEach(element => {
                    mailOptions.attachments.push(element);
                });

                await transporter.sendMail(mailOptions, async (error, info) => {

                    if(error) {
                        throw new Error(error.message);
                    }
                });
            }
            else {
                return false;
            }

            return true;
        } catch (ex) {

            const ERROR_MESSAGE = 'Error while sending email';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
