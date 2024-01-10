'use client'
import React from 'react'
import Footer from '@/components/teacher/Footer'
import Header from '@/components/teacher/Header'
import Sidebar from '@/components/teacher/Sidebar'

export default function layout({ children }) {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-grow">
				<div className="flex">
					<div className="hidden md:block">
						<Sidebar />
					</div>
					<div className="w-full md:ms-56">
						<Header />
						{children}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
