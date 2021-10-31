import { PaymentPlan } from './payment-plan';

export class SetupPaymentPlans {

    static paymentPlans(annual: boolean): PaymentPlan[] {

        if (annual) {
            return [
                {
                    id: 0,
                    amount: 0,
                    frequency: 3,
                    name: 'Free',
                    description: 'Free Plan',
                    benefits: [
                        '1 User',
                        '50 Contacts'
                    ]
                },
                {
                    id: 5,
                    amount: 891,
                    frequency: 6,
                    name: 'Starter',
                    description: 'Starter Plan',
                    benefits: [
                        '3 Users',
                        '600 Contacts',
                        'Excel Data Export'
                    ]
                },
                {
                    id: 6,
                    amount: 2241,
                    frequency: 3,
                    name: 'Professional',
                    description: 'Professional Plan',
                    benefits: [
                        '5 Users',
                        '1000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration'
                    ]
                },
                {
                    id: 7,
                    amount: 3501,
                    frequency: 3,
                    name: 'Elite',
                    description: 'Elite Plan',
                    benefits: [
                        '10 Users',
                        '2000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration',
                        'Active Campaign Integration',
                        'Hubspot Integration'
                    ]
                },
                {
                    id: 8,
                    amount: 5841,
                    frequency: 3,
                    name: 'Ultimate',
                    description: 'Ultimate Plan',
                    benefits: [
                        '50 Users',
                        '5000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration',
                        'Active Campaign Integration',
                        'Hubspot Integration'
                    ]
                }
            ];
        } else {
            return [
                {
                    id: 0,
                    amount: 0,
                    frequency: 3,
                    name: 'Free',
                    description: 'Free Plan',
                    benefits: [
                        '1 User',
                        '50 Contacts'
                    ]
                }, {
                    id: 1,
                    amount: 99,
                    frequency: 3,
                    name: 'Starter',
                    description: 'Starter Plan',
                    benefits: [
                        '3 Users',
                        '600 Contacts',
                        'Excel Data Export'
                    ]
                },
                {
                    id: 2,
                    amount: 249,
                    frequency: 3,
                    name: 'Professional',
                    description: 'Professional Plan',
                    benefits: [
                        '5 Users',
                        '1000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration'
                    ]
                },
                {
                    id: 3,
                    amount: 389,
                    frequency: 3,
                    name: 'Elite',
                    description: 'Elite Plan',
                    benefits: [
                        '10 Users',
                        '2000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration',
                        'Active Campaign Integration',
                        'Hubspot Integration'
                    ]
                },
                {
                    id: 4,
                    amount: 649,
                    frequency: 3,
                    name: 'Ultimate',
                    description: 'Ultimate Plan',
                    benefits: [
                        '50 Users',
                        '5000 Contacts',
                        'Excel Data Export',
                        'Google Sheet Integration',
                        'Active Campaign Integration',
                        'Hubspot Integration'
                    ]
                }
            ]
        }
    }

}