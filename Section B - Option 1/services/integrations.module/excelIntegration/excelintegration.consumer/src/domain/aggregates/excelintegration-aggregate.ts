import { ExcelIntegrationRepository } from '../repositories/excelintegration-repository';
import { ExcelIntegrationDataModel } from '../models/excelintegration-datamodel';
import { ExcelIntegrationResponse, ResponseStatus, ExcelIntegrationMessage } from '../../../../excelintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';
import { EmailProducer } from 'covidscreener-email/dist';
import Configuration from '../../configuration.json';

export class ExcelIntegrationAggregate {
    private repository: ExcelIntegrationRepository;

    constructor(repository: ExcelIntegrationRepository) {
        this.repository = repository;
    }

    async doAsync(message: ExcelIntegrationMessage<ExcelIntegrationDataModel>): Promise<ExcelIntegrationResponse> {
        try {
            if (message.data) {
                const result = await this.repository.doAsync(message);
                const filename = `${new ObjectID().toHexString()}.xlsx`;
                const path = Configuration.fileRootPath;
                await result.xlsx.writeFile(`${path}${filename}`);

                new EmailProducer().produceAsync({
                    eventName: 'EmailEvent',
                    id: new ObjectID(),
                    producedAt: new Date(),
                    version: 1,
                    data: {
                        to: [message.data.emailAddress],
                        from: 'support@creativ360.com',
                        subject: 'Your data export has been generated!',
                        message: '<b>A new data export report has been generated and is now available for download.</b><br /><br />Please follow the link to ' +
                            'download your data. This link is only usable one time:<br /><br />' +
                            `https://2020screener.com/#/data-export/${filename}` +
                            '<br /><br />Kind regards,<br />The Creativ360 team',
                        cc: [],
                        attachments: []
                    },
                    produceMessage: true
                });

                message.id = new ObjectID(message.id);

                if (result) {
                    const response = new ExcelIntegrationResponse(
                        message?.id?.toHexString(),
                        'ExcelIntegration request success',
                        ResponseStatus.success,
                        200,
                        {}
                    );

                    return response;
                } else {
                    const response = new ExcelIntegrationResponse(
                        message?.id?.toHexString(),
                        'ExcelIntegration request failure',
                        ResponseStatus.failure,
                        400,
                        {}
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new ExcelIntegrationResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ExcelIntegration consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
