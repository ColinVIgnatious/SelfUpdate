'use client'
import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { usePathname, useSearchParams } from 'next/navigation'

export default function LoadingProgress() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
    NProgress.configure({ showSpinner: false })
	useEffect(() => {
		const handleStart = () => NProgress.start()
		const handleStop = () => NProgress.done()

		handleStop()
		return () => {
			handleStart()
		}
	}, [pathname, searchParams])
	return <></>
}
