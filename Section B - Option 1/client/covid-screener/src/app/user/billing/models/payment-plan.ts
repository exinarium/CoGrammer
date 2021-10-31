export class PaymentPlan {

    constructor(
        public id: number,
        public name: string,
        public amount: number,
        public frequency: number,
        public description: string,
        public benefits: string[]
    ) { }
}