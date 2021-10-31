import { IJWTMapping } from './ijwt-mapping';
import { User } from '../models/user';

export class JWTMapping implements IJWTMapping {
    async mapToModel(decodedToken: any): Promise<User> {
        const user = new User(
            decodedToken.data._id,
            decodedToken.data.userId,
            decodedToken.data.organizationId,
            decodedToken.data.name,
            decodedToken.data.email,
            decodedToken.data.organization,
            decodedToken.data.paymentPlan,
            decodedToken.data.activeIntegrations,
            decodedToken.data.activeCampaignTagName,
            decodedToken.data.isAdminUser,
            decodedToken.data.roles,
            decodedToken.data.version,
            decodedToken.data.isDeleted
        );

        return user;
    }
}
