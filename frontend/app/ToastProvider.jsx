'use client'

import { ToastContainer, cssTransition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../public/animate.min.css'

const bounce = cssTransition({
	enter: 'animate__faster animate__headShake',
	exit: 'animate__faster animate__headShake',
})

export default function ToastProvider() {
	return (
		<ToastContainer
			position="bottom-center"
            style={{ width: '100%' }}
			autoClose={3000}
			hideProgressBar
			newestOnTop
			closeOnClick={false}
			rtl={false}
			pauseOnFocusLoss
			draggable={false}
			pauseOnHover
			theme="light"
			// transition={bounce}
		/>
	)
}
