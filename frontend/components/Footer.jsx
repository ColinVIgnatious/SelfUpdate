'use client'
import { Link } from '@nextui-org/react'
import Image from 'next/image'
import NextLink from 'next/link'
export default function Footer() {
	return (
		<div className="border-t-5 border-t-slate-100">
			<div className="container mx-auto py-6 max-w-screen-xl px-[1.5rem]">
				<Image src="/logo.svg" width={0} height={0} style={{width:'120px', height: "auto" }} alt="" priority={true}/>
				<div className="flex mt-6 gap-6">
					<div className='flex flex-col gap-2'>
						<Link as={NextLink} href="/teacher" size="sm">
							Teach on SelfUpdate
						</Link>
                        <Link as={NextLink} href="/admin" size="sm">
							Admin LogIn
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
