import mongodb, { ObjectID } from 'mongodb';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import axios from 'axios';
import { AxiosResponse } from 'axios';

export class ActiveCampaignIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async storeApiKey(apiKey: string, listId: number, apiUrl: string, user: any): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        let result: mongodb.UpdateWriteOpResult;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const organizationCollection = dataContext.db('Users').collection('Organization');
            const paymentPlanCollection = dataContext.db('Users').collection('PaymentPlans');

            const organization = await organizationCollection.findOne({ _id: new ObjectID(user.organizationId) });
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization.paymentPlan });

            if (paymentPlan.allowActiveCampaignIntegration !== true) {
                throw new Error(
                    'Your plan does not allow integration with Active Campaign'
                );
            }

            const existingRecord = await organizationCollection
                .findOne({
                    _id: new ObjectID(user.organization._id),
                });

            if (!existingRecord) {
                throw new Error(
                    'The organization does not exist'
                );
            }

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            result = await collection.updateOne({
                _id: new ObjectID(existingRecord._id)
            }, {
                $set: {
                    activeCampaign: { apiKey, apiUrl, listId }
                }
            });
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in ActiveCampaignIntegration while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        if (!result) {
            return false;
        } else {
            return true;
        }
    }

    async getAvailableLists(apiKey: string, apiUrl: string, user: any): Promise<AxiosResponse> {
        let dataContext: mongodb.MongoClient;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

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
                    'Your plan does not allow integration with Active Campaign'
                );
            }
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in ActiveCampaignIntegration while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        return axios.get(`${apiUrl}/api/3/lists`, {headers: { 'Api-Token' : apiKey }});
    }
}