'use client'
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { QueryClient } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import NextLink from 'next/link'
import { logoutUser } from '@/api/users'
import { logout } from '@/redux/slices/teacherSlice'
import Chat from './Chat'

export default function Header() {
	const { teacher } = useSelector((state) => state.teacher)

	const dispatch = useDispatch()
	const queryClient = new QueryClient()
    const router = useRouter()

	const handleLogout = async (e) => {
		try {
			const res = await queryClient.fetchQuery({
				queryFn: () => logoutUser('teacher')
			})
			if (res?.success) {
				dispatch(logout())
				toast.success('Logged out successfully')
                router.push('/teacher')
			} else toast.error('Something went wrong, please try again later')
		} catch (error) {
			toast.error('Something went wrong, please try again later')
		}
	}

	return (
		<Navbar maxWidth="full" className="border-b-1">
			{teacher && teacher.role == 'teacher' ? (
			
				
				<NavbarContent as="div" className="items-center" justify="end">
				<NavbarItem className="flex">
				<Chat/>
				</NavbarItem>

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
					<NavbarItem className="flex">
						<Link
							href="/teacher/login"
							variant="flat"
							color="primary"
							className="font-bold"
							as={NextLink}
							size="sm">
							Login
						</Link>
					</NavbarItem>

					<NavbarItem className="hidden md:flex">
						<Button
							as={NextLink}
							color="primary"
							variant="flat"
							href="/teacher/signup"
							className="font-bold"
							size="sm">
							Sign Up
						</Button>
					</NavbarItem>
				</NavbarContent>
			)}
		</Navbar>
	)
}
