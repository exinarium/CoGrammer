import mongodb, { ObjectID } from 'mongodb';
import { HubspotIntegrationDataModel } from '../models/hubspotintegration-datamodel';
import { HubspotIntegrationMessage } from '../../../../hubspotintegration.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import axios from 'axios';

export class HubspotIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async createContactAsync(message: HubspotIntegrationMessage<HubspotIntegrationDataModel>): Promise<boolean> {
        let dataContext: mongodb.MongoClient;
        const result = false;
        let organization: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const collection = dataContext
                .db(this.config.databaseConfig.databaseName)
                .collection(this.config.databaseConfig.collectionName);

            organization = await collection.findOne({
                _id: new ObjectID(message?.data?.organizationId)
            });

            if (!organization) {
                throw new Error('Organization not found');
            }

            if (!organization?.hubspot || !organization?.hubspot?.apiKey ||
                organization?.hubspot?.apiKey === '') {

                throw new Error('Organization has no Hubspot integration set up');
            }

            const paymentPlanCollection = dataContext.db('Users').collection('PaymentPlans');
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization?.paymentPlan });

            if (paymentPlan.allowHubspotIntegration !== true) {
                throw new Error(
                    'Your plan does not allow integration with Hubspot'
                );
            }
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in HubspotIntegration while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            await dataContext.close();
        }

        const contactSearchRequest = {

            filterGroups: [
                {
                    filters: [
                        {
                            value: message?.data?.email,
                            propertyName: 'email',
                            operator: 'EQ'
                        }
                    ]
                }
            ],
            properties: [
                "firstname",
                "lastname",
                "email",
                "phone",
                "users2020screener"
            ]
        };

        const existingContact = await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts/search?hapikey=${organization.hubspot.apiKey}`,
            contactSearchRequest);

        if (existingContact?.data && existingContact?.data?.results?.length > 0) {

            const existingContactDetails = existingContact?.data?.results[0];

            const users = existingContactDetails?.properties?.users2020screener?.includes(message?.data?.activeCampaignTagName?.toString()) ?
                existingContactDetails?.properties?.users2020screener :
                `${existingContactDetails?.properties?.users2020screener}; ${message?.data?.activeCampaignTagName?.toString()}`

            const contactUpdateRequest = {
                properties: {
                    firstname: message?.data?.firstName?.toString(),
                    lastname: message?.data?.lastName?.toString(),
                    email: message?.data?.email?.toString(),
                    phone: message?.data?.phone?.toString(),
                    users2020screener: users?.toString()
                }
            }

            const contactResult = await axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingContactDetails?.id}?hapikey=${organization.hubspot.apiKey}`,
                contactUpdateRequest);

            if (contactResult && contactResult?.status === 200) {
                return true;
            }
            else {
                return false;
            }
        } else {
            const contactCreateRequest = {
                properties: {
                    firstname: message?.data?.firstName?.toString(),
                    lastname: message?.data?.lastName?.toString(),
                    email: message?.data?.email?.toString(),
                    phone: message?.data?.phone?.toString(),
                    users2020screener: message?.data?.activeCampaignTagName?.toString()
                }
            }

            const contactResult = await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${organization.hubspot.apiKey}`,
                contactCreateRequest);

            if (contactResult && contactResult?.status === 201) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}
