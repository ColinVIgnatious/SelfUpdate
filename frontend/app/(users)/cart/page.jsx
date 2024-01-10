'use client'

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripeIntent } from '@/api/courses'

const CheckoutForm = () => {
	const stripe = useStripe()
	const elements = useElements()

	const [errorMessage, setErrorMessage] = useState(null)

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (elements == null) {
			return
		}

		// Trigger form validation and wallet collection
		const { error: submitError } = await elements.submit()
		if (submitError) {
			// Show error to your customer
			setErrorMessage(submitError.message)
			return
		}

		// const res = await queryClient.fetchQuery({
		// 	queryFn: getStripeIntent,
		// 	queryKey: [''],
		// })

		// const { clientSecret } = await res.json()

		const clientSecret = 'pi_3O9OZKSEzr2pEOZe0Uik04pu_secret_2TyoFYsuBNVxe59rzU3CrRbqz'

		const { error } = await stripe.confirmPayment({
			//`Elements` instance that was used to create the Payment Element
			elements,
			clientSecret,
			confirmParams: {
				return_url: 'http://localhost:3000/stripe/complete',
			},
		})

		if (error) {
			// This point will only be reached if there is an immediate error when
			// confirming the payment. Show error to your customer (for example, payment
			// details incomplete)
			setErrorMessage(error.message)
		} else {
			// Your customer will be redirected to your `return_url`. For some payment
			// methods like iDEAL, your customer will be redirected to an intermediate
			// site first to authorize the payment, then redirected to the `return_url`.
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button type="submit" disabled={!stripe || !elements}>
				Pay
			</button>
			{/* Show error message to your customers */}
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	)
}

const stripePromise = loadStripe(
	'pk_test_51O9MwESEzr2pEOZeJErB1WdFLk6tTlqjMyeGz8aGffayTMbi8WBg1vlemAuvW2Xlxa8VF6mcesJV5z3KJSYZ0CB100haQcK2M6'
)

const options = {
	mode: 'payment',
	amount: 100 * 100,
	currency: 'inr',
}

export default function Page() {
	return (
		<div className='w-[400px]'>
			<p>checkout stripe</p>
			<Elements stripe={stripePromise} options={options}>
				<CheckoutForm />
			</Elements>
		</div>
	)
}
