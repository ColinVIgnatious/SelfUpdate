'use client'
import { Link } from '@nextui-org/react'
import { PieChart, Shapes, Users,FileCheck } from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Sidebar() {
	const pathname = usePathname()
	const isActive = (path) => {
        if(pathname === '/teacher' && path === '/teacher/analytics') return true
		return pathname.startsWith(path)
	}

	return (
		<div className="fixed top-0 left-0 h-screen w-56 border-e-1 pt-8">
			<Image className='ps-4'src="/logo.svg" width={0} height={0} style={{width:'120px', height: "auto" }} alt="" priority={true}/>
			<ul className="mt-6 flex flex-col">
				<li>
					<Link
						className={
							isActive('/teacher/analytics')
								? 'w-full h-full ps-4 py-2 pointer-events-none transition-all duration-150 active:scale-[0.98] bg-primary-50'
								: 'w-full h-full ps-4 py-2 cursor-pointer transition-all duration-150 active:scale-[0.98] text-foreground-500 hover:bg-default-100'
						}
						as={NextLink}
						href="/teacher"
						size="md">
						<PieChart size={16} />
						<p className="text-medium font-medium ps-2">Analytics</p>
					</Link>
				</li>
				<li>
					<Link
						className={
							isActive('/teacher/courses')
								? 'w-full h-full ps-4 py-2 pointer-events-none transition-all duration-150 active:scale-[0.98] bg-primary-50'
								: 'w-full h-full ps-4 py-2 cursor-pointer transition-all duration-150 active:scale-[0.98] text-foreground-500 hover:bg-default-100'
						}
						as={NextLink}
						href="/teacher/courses"
						size="md">
						<Shapes size={16} />
						<p className="text-medium font-medium ps-2">Courses</p>
					</Link>
				</li>
				<li>
					<Link
						className={
							isActive('/teacher/students')
								? 'w-full h-full ps-4 py-2 pointer-events-none transition-all duration-150 active:scale-[0.98] bg-primary-50'
								: 'w-full h-full ps-4 py-2 cursor-pointer transition-all duration-150 active:scale-[0.98] text-foreground-500 hover:bg-default-100'
						}
						as={NextLink}
						href="/teacher/enrollments"
						size="md">
						<FileCheck size={16} />
						<p className="text-medium font-medium ps-2">Enrollments</p>
					</Link>
				</li>
				
			</ul>
		</div>
	)
}
