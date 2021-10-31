import { ObjectID } from 'mongodb';
import { GroupMember } from './group-member';

export class CandidateInteractionDataModel {
    constructor(
        public _id: ObjectID,
        public userId: ObjectID,
        public organizationId: ObjectID,
        public clientImage: string,
        public meetingAddress: string,
        public temperature: number,
        public clientClassification: string,
        public suspectedCovid19: boolean,
        public symptomsCovid19: boolean,
        public directContactCovid19: boolean,
        public indirectContactCovid19: boolean,
        public testedCovid19: boolean,
        public travelledProvincially: boolean,
        public travelledInternationally: boolean,
        public autoImmuneDisease: boolean,
        public additionalNotes: string,
        public additionalGroupMembers: GroupMember[],
        public confirmInformationCorrect: boolean,
        public profileId: ObjectID,
        public modifiedDate: Date,
        public username: string,
        public version: number = 1,
        public isDeleted: boolean = false
    ) { }
}
