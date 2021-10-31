import { CandidateInteractionDataModel } from '../models/candidateinteraction-datamodel';

export class CandidateInteractionMapping {
    mapToModel(request: any): Promise<CandidateInteractionDataModel> {
        return request;
    }
}
