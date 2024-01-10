'use client'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

export default function layout({ children }) {
	return (
		<GoogleOAuthProvider clientId="588761940823-n7hlam36ge1gf3v5t9ii53haapsue8bf.apps.googleusercontent.com">
			{children}
		</GoogleOAuthProvider>
	)
}
