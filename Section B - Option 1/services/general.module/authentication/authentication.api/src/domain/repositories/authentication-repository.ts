import { IAuthenticationRepository } from './iauthentication-repository';
import mongodb, { ObjectID } from 'mongodb';
import { Authentication } from '../models/authentication';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { User } from '../models/user';
import { SecurityUtils } from '../utilities/security-utils';

export class AuthenticationRepository implements IAuthenticationRepository {
    constructor(private config: Config) { }

    async authUserAsync(model: Authentication): Promise<User> {
        let dataContext: mongodb.MongoClient;
        let user: any;

        try {
            const connectionString = this.config.databaseConfig.connectionString;

            if (connectionString === undefined || connectionString === '') {
                throw new Error('Connection string cannot be null or empty');
            }

            dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

            const database = dataContext.db(this.config.databaseConfig.databaseName);
            let collection = database.collection(this.config.databaseConfig.userCollectionName);

            const userFilter = { password: SecurityUtils.encrypt(model.password), email: model.email, isVerified: true, isDeleted: false };
            const result = await collection.findOne(userFilter);

            if (result) {
                const organizationId: ObjectID = result.organizationId;

                if (organizationId) {
                    collection = database.collection(this.config.databaseConfig.organizationCollectionName);
                    const organizationFilter = { _id: organizationId };

                    let organization: any = {};
                    organization = await collection.findOne(organizationFilter, { projection: { activeCampaign: 0, googleApi: 0, hubspot: 0 } });

                    if ((organization?.payments?.paymentStatus === 'Cancelled' && new Date() > new Date(organization?.payments?.nextBillingDate)) || organization.isDeleted) {

                        throw new EvalError('Account has been suspended. Please contact support for any queries');
                    } else {

                        if (organization?.payments) {
                            organization.payments.subscriptionToken = '';
                        }
                    }

                    const paymentPlanCollection = dataContext.db('Users').collection('PaymentPlans');
                    const paymentPlan = await paymentPlanCollection.findOne({ planNumber: organization.paymentPlan });

                    let organizationData: any = {};
                    organizationData = await collection.findOne(organizationFilter, { projection: { activeCampaign: 1, googleApi: 1, hubspot: 1 } });

                    const activeIntegrations = {
                        google: organizationData?.googleApi?.sheetId && organizationData?.googleApi?.sheetId !== '',
                        activeCampaign: organizationData?.activeCampaign?.apiKey && organizationData?.activeCampaign?.apiKey !== '',
                        hubspot: organizationData?.hubspot?.apiKey && organizationData?.hubspot?.apiKey !== '',
                    };

                    if (!organization.isDeleted) {
                        user = new User(
                            result._id,
                            result.userId,
                            result.organizationId,
                            result.name,
                            result.email,
                            organization,
                            paymentPlan,
                            activeIntegrations,
                            result.activeCampaignTagName,
                            result.isAdminUser,
                            result.roles,
                            result.version,
                            result.isDeleted
                        );
                    }
                }
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error in Authentication while retrieving user details';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        } finally {

            dataContext?.close();
        }

        return user;
    }
}
