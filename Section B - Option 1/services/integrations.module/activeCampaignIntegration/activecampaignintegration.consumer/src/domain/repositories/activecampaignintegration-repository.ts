import mongodb, { ObjectID } from 'mongodb';
import { ActiveCampaignIntegrationDataModel } from '../models/activecampaignintegration-datamodel';
import { ActiveCampaignIntegrationMessage } from '../../../../activecampaignintegration.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import axios from 'axios';

export class ActiveCampaignIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async createContactAsync(message: ActiveCampaignIntegrationMessage<ActiveCampaignIntegrationDataModel>): Promise<boolean> {
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

            if (!organization?.activeCampaign || !organization?.activeCampaign?.apiKey ||
                organization?.activeCampaign?.apiKey === '' || organization?.activeCampaign?.listId <= 0 ||
                !organization?.activeCampaign?.apiUrl || organization?.activeCampaign?.apiUrl === '') {

                throw new Error('Organization has no active campaign integration set up');
            }

            const paymentPlanCollection = dataContext.db('Users').collection('PaymentPlans');
            const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization?.paymentPlan });

            if (paymentPlan.allowActiveCampaignIntegration !== true) {
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

        const contactCreateRequest = {
            contact: {
                firstName: message?.data?.firstName,
                lastName: message?.data?.lastName,
                email: message?.data?.email,
                phone: message?.data?.phone
            }
        }

        const contactResult = await axios.post(`${organization?.activeCampaign?.apiUrl}/api/3/contact/sync`,
            contactCreateRequest,
            { headers: { 'Api-Token': organization?.activeCampaign?.apiKey } });

        if (contactResult && contactResult?.data?.contact) {

            const contactId = contactResult.data.contact.id;

            const listUpdateRequest = {
                contactList: {
                    list: organization?.activeCampaign?.listId,
                    contact: Number(contactId),
                    status: 1
                }
            };

            const contactList = await axios.post(`${organization?.activeCampaign?.apiUrl}/api/3/contactLists`,
                listUpdateRequest,
                { headers: { 'Api-Token': organization?.activeCampaign?.apiKey } })

            if (contactList) {

                if (message.data.activeCampaignTagName && message.data.activeCampaignTagName !== '') {

                    // Optional
                    const tagData = await axios.get(`${organization?.activeCampaign?.apiUrl}/api/3/tags`,
                        { headers: { 'Api-Token': organization?.activeCampaign?.apiKey } })

                    if (tagData) {

                        if (tagData?.data?.tags) {

                            const tags = tagData?.data?.tags;

                            // tslint:disable-next-line:no-implicit-any
                            let tagId = tags.find(x => x.tag === message.data.activeCampaignTagName)?.id;

                            if (!tagId || tagId === '') {

                                const createTagRequest = {
                                    tag: {
                                        tag: message.data.activeCampaignTagName,
                                        tagType: "contact",
                                        description: "Modified By"
                                    }
                                };

                                const createdTag = await axios.post(`${organization?.activeCampaign?.apiUrl}/api/3/tags`,
                                    createTagRequest,
                                    { headers: { 'Api-Token': organization?.activeCampaign?.apiKey } })

                                if (createdTag?.data?.tag?.id) {
                                    tagId = createdTag?.data?.tag?.id;
                                } else {
                                    return true;
                                }
                            }

                            const tagLink = {
                                contactTag: {
                                    contact: contactId.toString(),
                                    tag: tagId.toString()
                                }
                            };

                            const taggedContact = await axios.post(`${organization?.activeCampaign?.apiUrl}/api/3/contactTags`,
                                tagLink,
                                { headers: { 'Api-Token': organization?.activeCampaign?.apiKey } })

                            return true;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
