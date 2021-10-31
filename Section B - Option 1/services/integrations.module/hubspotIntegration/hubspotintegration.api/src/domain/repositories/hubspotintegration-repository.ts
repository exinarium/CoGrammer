import mongodb, { ObjectID } from 'mongodb';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import axios from 'axios';

export class HubspotIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async storeApiKey(apiKey: string, user: any): Promise<boolean> {
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

            if (paymentPlan.allowHubspotIntegration !== true) {
                throw new Error(
                    'Your plan does not allow integration with Hubspot'
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
                    hubspot: { apiKey }
                }
            });
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in HubspotIntegrationRepository while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        if (!result) {
            return false;
        } else {

            try {
                const screenerProperty = await axios.get(`https://api.hubapi.com/properties/v1/contacts/properties/named/users2020screener?hapikey=${apiKey}`);

                if (screenerProperty?.status === 200 && screenerProperty?.data?.name === 'users2020screener') {
                    return true;
                } else {
                    return false;
                }
            } catch (ex) {

                if (ex.isAxiosError) {
                    const propertyCreateRequest = {
                        "name": "users2020screener",
                        "label": "2020 Screener Users",
                        "description": "A list of users who modified the contact through the 2020 Screener App",
                        "groupName": "contactinformation",
                        "type": "string",
                        "fieldType": "text",
                        "formField": false
                    };

                    const screenerProperty = await axios.post(`https://api.hubapi.com/properties/v1/contacts/properties?hapikey=${apiKey}`,
                        propertyCreateRequest);

                    if (screenerProperty.status === 200 && screenerProperty?.data?.name === 'users2020screener') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    throw ex;
                }
            }
        }
    }
}