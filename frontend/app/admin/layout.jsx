import Footer from '@/components/admin/Footer'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import React from 'react'

export default function layout({ children }) {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-grow">
				<div className="flex">
					<div className="hidden md:block h-[100px]">
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
