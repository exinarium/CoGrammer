import { GoogleSheetIntegrationResponse, ResponseStatus, GoogleSheetIntegrationRequest, StatusCode } from '../../../../googlesheetintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { GoogleSheetIntegrationValidation } from '../validation/googlesheetintegration-validation';
import { GoogleTokenRepository } from '../repositories/googletoken-repository';
import { GoogleSheetIntegrationRepository } from '../repositories/googlesheetintegration-repository';
import { google } from 'googleapis';
import { Config } from '../config/config';
import { ObjectID } from 'mongodb';
import { EmailProducer } from 'covidscreener-email/dist';

export class GoogleSheetIntegrationAggregate {
    constructor(
        private validation: GoogleSheetIntegrationValidation,
        private googleTokenRepository: GoogleTokenRepository,
        private googleDatabaseRepository: GoogleSheetIntegrationRepository,
        private config: Config
    ) { }

    async doAsync(request: GoogleSheetIntegrationRequest, user: any): Promise<GoogleSheetIntegrationResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const oauth2Client = new google.auth.OAuth2(
                this.config.googleConfig.clientId,
                this.config.googleConfig.clientSecret,
                this.config.googleConfig.redirectUrl
            );

            const accessToken = await this.googleTokenRepository.getAccessToken(request.accessCode, oauth2Client);

            if (accessToken) {

                const resource = this.buildResource();

                const sheet = await this.googleDatabaseRepository.createSheet(oauth2Client, resource);

                if (sheet) {

                    const result = this.googleDatabaseRepository.saveTokenToDatabase(user, accessToken, sheet.spreadsheetId, sheet.spreadsheetUrl);

                    if (result) {

                        new EmailProducer().produceAsync({
                            eventName: 'EmailEvent',
                            id: new ObjectID(),
                            producedAt: new Date(),
                            version: 1,
                            data: {
                                to: [user.email],
                                from: 'support@creativ360.com',
                                subject: 'Your Google integration has been set up!',
                                message: '<b>A new Google Sheet has been created for you on your Google Drive.</b><br /><br />Please follow the link to ' +
                                    'access your sheet:<br /><br />' +
                                    `${sheet.spreadsheetUrl}` +
                                    '<br /><br />Kind regards,<br />The Creativ360 team',
                                cc: [],
                                attachments: []
                            },
                            produceMessage: true
                        });


                        const response = {
                            id: request.id,
                            message: 'Google Authentication request success',
                            status: ResponseStatus.success,
                            code: StatusCode.ok,
                            data: {},
                        };

                        return response;
                    } else {
                        const response = {
                            id: request.id,
                            message: 'Failed to save token to database',
                            status: ResponseStatus.failure,
                            code: StatusCode.internalServerError,
                            data: {}
                        };

                        return response;
                    }
                } else {
                    const response = {
                        id: request.id,
                        message: 'Failed to create sheet',
                        status: ResponseStatus.failure,
                        code: StatusCode.internalServerError,
                        data: {}
                    };

                    return response;
                }
            } else {
                const response = {
                    id: request.id,
                    message: 'Failed to get access token',
                    status: ResponseStatus.failure,
                    code: StatusCode.internalServerError,
                    data: {}
                };

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in GoogleSheetIntegration API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    buildResource(): any {

        const resource = {
            properties: {
                title: '2020 Screener Data'
            },
            sheets: [
                {
                    properties: {
                        title: 'Contacts'
                    },
                    data: [
                        {
                            startRow: 0,
                            startColumn: 0,
                            rowData: [
                                {
                                    values: [
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Profile ID'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'First Name'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Last Name'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'ID Number'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Telephone Number'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Email Address'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Physical Address'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Marketing Consent'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Covid-19 Consent'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Modified By'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        },
                                        {
                                            userEnteredValue: {
                                                stringValue: 'Modified Date'
                                            },
                                            userEnteredFormat: {
                                                horizontalAlignment: 'CENTER',
                                                textFormat: { bold: true }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        };

        return resource;
    }
}
