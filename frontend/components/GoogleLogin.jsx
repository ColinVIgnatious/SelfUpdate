import { Button } from '@nextui-org/react'
import React from 'react'
import { Google } from './icons/Google'

export default function GoogleLogin({isLoading, loginwithGoogle}) {
	return (
		<Button
			className="py-5 border-2 border-slate-200 hover:bg-slate-50"
			isLoading={isLoading}
			spinnerPlacement={'end'}
			variant="bordered"
			startContent={<Google />}
			size="md"
			fullWidth={true}
			onClick={() => loginwithGoogle()}>
			Continue with Google
		</Button>
	)
}
