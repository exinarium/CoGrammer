import { Config } from "../config/config";
import mongodb, { ObjectID, FilterQuery, ObjectId } from 'mongodb';
import { userInfo } from "os";
import { GoogleApi } from "../models/google-datamodel";
import { LoggingProducer } from "covidscreener-logging/dist/logging.producer/src";
import { LogPriority } from "covidscreener-logging/dist/logging.producer/src/domain/models/log-priority";
import { google, sheets_v4 } from "googleapis";

export class GoogleSheetIntegrationRepository {

    constructor(private config: Config) { }

    async saveTokenToDatabase(user: any, token: any, sheetId: string, sheetUrl: string): Promise<boolean> {

        let dataContext: mongodb.MongoClient;
        let model: any;

        try {
            const connectionString = this.config.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const organizationCollection = dataContext.db('Users').collection('Organization');
            const paymentPlanCollection = dataContext.db('Users').collection('PaymentPlans');

            const organization = await organizationCollection.findOne({ _id: new ObjectID(user.organizationId) });
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization.paymentPlan });

            if (paymentPlan.allowGoogleIntegration !== true) {
                throw new Error(
                    'Your plan does not allow integration with Google Sheets'
                );
            }

            const existingRecord = await organizationCollection
                .findOne({
                    _id: new ObjectId(user.organization._id),
                });

            if (!existingRecord) {
                throw new Error(
                    'The organization does not exist'
                );
            }

            model = await organizationCollection.updateOne({
                _id: new ObjectID(existingRecord._id)
            },
                {
                    $set: {
                        googleApi: new GoogleApi(token, sheetId, sheetUrl)
                    }
                });
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in GoogleSheetIntegrationRepository while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {
            await dataContext?.close();
        }

        return model?.modifiedCount > 1;
    }

    async createSheet(authClient: any, resource: any): Promise<sheets_v4.Schema$Spreadsheet> {
        const sheets = google.sheets('v4');
        const request = {
            resource,
            auth: authClient,
        };

        try {
            const response = (await sheets.spreadsheets.create(request)).data;
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in GoogleSheetIntegrationRepository while creating a sheet';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}