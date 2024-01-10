'use client'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

export default function layout({ children }) {
	return (
		<GoogleOAuthProvider clientId="531140445566-qc3k8gvn9ise75m3rhf7oq98nln0b1kv.apps.googleusercontent.com">
			<div className="min-h-screen flex flex-col gap-4">
				<Header />
				<div className="flex-grow w-full max-w-screen-xl mx-auto px-[1.5rem]">{children}</div>
				<Footer />
			</div>
		</GoogleOAuthProvider>
	)
}
