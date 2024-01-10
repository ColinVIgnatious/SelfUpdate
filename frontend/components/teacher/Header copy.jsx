'use client'
import React, { useEffect, useState } from 'react'
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	Avatar,
	Input,
} from '@nextui-org/react'
import { ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale, SearchIcon } from '../Icons.jsx'
import NextLink from 'next/link'
import Image from 'next/image.js'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/slices/teacherSlice'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/api/users.js'
import toast from 'react-hot-toast'
import { QueryClient } from 'react-query'

export default function Header() {
	const { teacher } = useSelector((state) => state.teacher)
	
	const dispatch = useDispatch()
	const router = useRouter()
    const queryClient = new QueryClient()

	const handleLogout = async (e) => {
		try {
			const res = await queryClient.fetchQuery({
				queryFn: () => logoutUser('teacher'),
			})
			if (res?.success) {
				dispatch(logout())
                toast.success('Logged out successfully')
			} else toast.error('Something went wrong, please try again later')
		} catch (error) {
			toast.error('Something went wrong, please try again later')
		}
	}

	return (
		<Navbar maxWidth="full" className="border-b-1">
			{teacher ? (
				<NavbarContent as="div" className="items-center" justify="end">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar
								isBordered
								as="button"
								className="transition-transform"
								color="#2D4059"
								name={teacher?.email.slice(0, 1).toUpperCase()}
								size="sm"
								src=""
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" variant="flat" className="text-default-500">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">{teacher?.email}</p>
							</DropdownItem>
							<DropdownItem key="configurations">My Courses</DropdownItem>
							<DropdownItem key="settings">Settings</DropdownItem>
							<DropdownItem key="help_and_feedback">Dark mode</DropdownItem>
							<DropdownItem key="logout" color="danger" onClick={handleLogout}>
								Log Out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			) : (
				<NavbarContent as="div" className="items-center" justify="end">
					<NavbarItem className="hidden lg:flex">
						<Link href="/teacher/login" className="font-bold" as={NextLink}>
							Login
						</Link>
					</NavbarItem>
				</NavbarContent>
			)}
		</Navbar>
	)
}
