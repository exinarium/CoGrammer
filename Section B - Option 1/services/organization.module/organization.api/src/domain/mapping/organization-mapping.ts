import { OrganizationDataModel } from '../models/organization-datamodel';

export class OrganizationMapping {
    async mapToModel(request: any): Promise<OrganizationDataModel> {
        return request;
    }

    async mapWebhookToModel(request: any): Promise<OrganizationDataModel> {

        const organization = new OrganizationDataModel(
            undefined,
            request.companyName,
            request.country,
            request.email,
            0,
            new Date()
        );

        return organization;
    }
}
