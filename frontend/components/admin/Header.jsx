'use client'
import React, { useLayoutEffect, useMemo } from 'react'
import {
	Navbar,
	NavbarContent,
	NavbarItem,
	Button,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	Avatar,
	useDisclosure,
} from '@nextui-org/react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/slices/adminSlice'
import { logoutUser } from '@/api/users.js'
import toast from 'react-hot-toast'
import { QueryClient } from 'react-query'
import LoginModal from './LoginModal.jsx'

export default function Header() {
	const { admin } = useSelector((state) => state.admin)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const dispatch = useDispatch()
	const queryClient = new QueryClient()

	useMemo(() => {
		if (!admin) onOpen()
	}, [admin])

	const handleLogout = async (e) => {
		try {
			const res = await queryClient.fetchQuery({
				queryFn: () => logoutUser('admin'),
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
		<>
			<Navbar maxWidth="full" className="border-b-1">
				{admin ? (
					<NavbarContent as="div" className="items-center" justify="end">
						<NavbarItem>
							<Dropdown placement="bottom-end">
								<DropdownTrigger>
									<Avatar
										isBordered
										as="button"
										className="transition-transform"
										color="#2D4059"
										name={admin?.email.slice(0, 1).toUpperCase()}
										size="sm"
										src=""
									/>
								</DropdownTrigger>
								<DropdownMenu aria-label="Profile Actions" variant="flat" className="text-default-500">
									<DropdownItem key="profile" className="h-14 gap-2">
										<p className="font-semibold">Signed in as</p>
										<p className="font-semibold">{admin?.email}</p>
									</DropdownItem>
									{/* <DropdownItem key="configurations">My Courses</DropdownItem> */}
									<DropdownItem key="settings">Settings</DropdownItem>
									<DropdownItem key="help_and_feedback">Dark mode</DropdownItem>
									<DropdownItem key="logout" color="danger" onClick={handleLogout}>
										Log Out
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</NavbarItem>
					</NavbarContent>
				) : (
					<NavbarContent as="div" className="items-center" justify="end">
						<NavbarItem className="hidden lg:flex">
							<Button variant="light" onClick={onOpen}>
								Login
							</Button>
						</NavbarItem>
					</NavbarContent>
				)}
			</Navbar>
			<LoginModal isOpen={isOpen} onClose={onClose} />
		</>
	)
}

// import React from 'react'
// import {
// 	Navbar,
// 	NavbarBrand,
// 	NavbarMenuToggle,
// 	NavbarMenuItem,
// 	NavbarMenu,
// 	NavbarContent,
// 	NavbarItem,
// 	Link,
// 	Button,
//     Dropdown,
//     DropdownTrigger,
//     Avatar,
//     DropdownMenu,
//     DropdownItem,
// } from '@nextui-org/react'
// import { Flower } from 'lucide-react'

// export default function App() {
// 	const [isMenuOpen, setIsMenuOpen] = React.useState(false)

// 	const menuItems = [
// 		'Profile',
// 		'Dashboard',
// 		'Activity',
// 		'Analytics',
// 		'System',
// 		'Deployments',
// 		'My Settings',
// 		'Team Settings',
// 		'Help & Feedback',
// 		'Log Out',
// 	]

// 	return (
// 		<Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
// 			<NavbarContent className="sm:hidden" justify="start">
// 				<NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
// 			</NavbarContent>

// 			<NavbarContent className="sm:hidden pr-3" justify="center">
// 				<NavbarBrand>
// 					<Flower />
// 					<p className="font-bold text-inherit">ACME</p>
// 				</NavbarBrand>
// 			</NavbarContent>

// 			<NavbarContent className="hidden sm:flex gap-4" justify="center">
// 				<NavbarBrand>
// 					<Flower />
// 					<p className="font-bold text-inherit">ACME</p>
// 				</NavbarBrand>
// 				<NavbarItem>
// 					<Link color="foreground" href="#">
// 						Features
// 					</Link>
// 				</NavbarItem>
// 				<NavbarItem isActive>
// 					<Link href="#" aria-current="page">
// 						Customers
// 					</Link>
// 				</NavbarItem>
// 				<NavbarItem>
// 					<Link color="foreground" href="#">
// 						Integrations
// 					</Link>
// 				</NavbarItem>
// 			</NavbarContent>

// 			<NavbarContent justify="end">
// 				<NavbarItem className="hidden lg:flex">
// 					<Link href="#">Login</Link>
// 				</NavbarItem>
// 				<NavbarItem>
// 					<Dropdown placement="bottom-end">
// 						<DropdownTrigger>
// 							<Avatar
// 								isBordered
// 								as="button"
// 								className="transition-transform"
// 								color="#2D4059"
// 								name='test'
// 								size="sm"
// 								src=""
// 							/>
// 						</DropdownTrigger>
// 						<DropdownMenu aria-label="Profile Actions" variant="flat" className="text-default-500">
// 							<DropdownItem key="profile" className="h-14 gap-2">
// 								<p className="font-semibold">Signed in as</p>
// 								<p className="font-semibold">email</p>
// 							</DropdownItem>
// 							<DropdownItem key="configurations">My Courses</DropdownItem>
// 							<DropdownItem key="settings">Settings</DropdownItem>
// 							<DropdownItem key="help_and_feedback">Dark mode</DropdownItem>
// 							<DropdownItem key="logout" color="danger">
// 								Log Out
// 							</DropdownItem>
// 						</DropdownMenu>
// 					</Dropdown>
// 				</NavbarItem>
// 			</NavbarContent>

// 			<NavbarMenu>
// 				{menuItems.map((item, index) => (
// 					<NavbarMenuItem key={`${item}-${index}`}>
// 						<Link
// 							className="w-full"
// 							color={index === 2 ? 'warning' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
// 							href="#"
// 							size="lg">
// 							{item}
// 						</Link>
// 					</NavbarMenuItem>
// 				))}
// 			</NavbarMenu>
// 		</Navbar>
// 	)
// }
