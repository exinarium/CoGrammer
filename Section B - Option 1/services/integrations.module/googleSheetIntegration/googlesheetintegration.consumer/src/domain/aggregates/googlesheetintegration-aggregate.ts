import { GoogleSheetIntegrationRepository } from '../repositories/googlesheetintegration-repository';
import { GoogleSheetIntegrationDataModel } from '../models/googlesheetintegration-datamodel';
import { GoogleSheetIntegrationResponse, ResponseStatus, GoogleSheetIntegrationMessage } from '../../../../googlesheetintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';
import { google } from 'googleapis';
import { Config } from '../config/config';

export class GoogleSheetIntegrationAggregate {
    private repository: GoogleSheetIntegrationRepository;

    constructor(repository: GoogleSheetIntegrationRepository, private config: Config) {
        this.repository = repository;
    }

    async doAsync(message: GoogleSheetIntegrationMessage<GoogleSheetIntegrationDataModel>): Promise<GoogleSheetIntegrationResponse> {
        try {
            if (message.data) {
                const tokenData = await this.repository.getGoogleToken(message);

                if (!tokenData?.googleApi?.token.refresh_token) {
                    throw new Error('Token is not available');
                }

                message.id = new ObjectID(message.id);

                const sheets = google.sheets('v4');
                const oauth2Client = new google.auth.OAuth2(
                    this.config.googleConfig.clientId,
                    this.config.googleConfig.clientSecret,
                    this.config.googleConfig.redirectUrl
                );

                oauth2Client.setCredentials({
                    refresh_token: tokenData.googleApi.token.refresh_token
                })

                oauth2Client
                    .getRequestHeaders().then((value) => {

                        sheets.spreadsheets.values.append({
                            spreadsheetId: tokenData.googleApi.sheetId,
                            range: message.data.sheetName,
                            valueInputOption: 'USER_ENTERED',
                            insertDataOption: 'INSERT_ROWS',
                            requestBody: {
                                values: [
                                    message.data.values
                                ],
                            },
                            auth: oauth2Client
                        });
                    })
                    .catch((error) => {
                        if (error) {
                            const errorResponse = new GoogleSheetIntegrationResponse(
                                message?.id?.toHexString(),
                                'GoogleSheetIntegration request failed',
                                ResponseStatus.failure,
                                500,
                                {}
                            );

                            return errorResponse;
                        }
                    });

                const response = new GoogleSheetIntegrationResponse(
                    message?.id?.toHexString(),
                    'GoogleSheetIntegration request success',
                    ResponseStatus.success,
                    200,
                    {}
                );

                return response;
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new GoogleSheetIntegrationResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in GoogleSheetIntegration consumer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
