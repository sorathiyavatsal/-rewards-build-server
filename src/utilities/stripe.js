import config from "../conf";
import Stripe from 'stripe';
import { stripeAmountPadding } from ".";
const stripe = new Stripe( config.stripe[ 'key' ] );

export async function createCustomer ( email ) {
    return stripe.customers.create( { email } );
}

export async function updateCustomer ( customerId, data ) {
    return stripe.customers.update( customerId, data );
}

export async function deleteCustomer ( customerId ) {
    return stripe.customers.del( customerId );
}

export async function chargeCustomer ( data ) {
    return stripe.charges.create( data );
}

export async function createToken () {
    return stripe.tokens.create( {
        card: {
            number: '4242424242424242',
            exp_month: 7,
            exp_year: 2022,
            cvc: '314',
        },
    } );
}

export async function createCard ( customer ) {
    return stripe.customers.createSource( customer, { source: 'tok_mastercard' } );
}

export async function buyReward ( price ) {
    return stripe.transfers.create( {
        amount: stripeAmountPadding( price ),
        currency: 'usd',
        destination: 'cus_JrxwP6fP8RzCmw',
    } );
}

export async function getMyBalance () {
    const balance = await stripe.balance.retrieve();

    if ( !balance.livemode )
    {
        return balance.pending.length > 0 ? balance.pending[ 0 ].amount : 0;
    } else
    {
        return balance.available.length > 0 ? balance.available[ 0 ].amount : 0;
    }
}

