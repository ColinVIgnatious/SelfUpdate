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
import { ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale, SearchIcon } from './Icons.jsx'
import NextLink from 'next/link'
import Image from 'next/image.js'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { logoutUser } from '@/api/users.js'
import { logout } from '@/redux/slices/userSlice.js'
import { QueryClient, useQuery } from 'react-query'
import toast from 'react-hot-toast'
import { getAllCategoriesUser } from '@/api/categories.js'
import { MessageSquareText } from 'lucide-react'
import Chat from './Chat.jsx'


export default function Header() {
	const icons = {
		chevron: <ChevronDown fill="currentColor" size={16} />,
		scale: <Scale className="text-warning" fill="currentColor" size={30} />,
		lock: <Lock className="text-success" fill="currentColor" size={30} />,
		activity: <Activity className="text-secondary" fill="currentColor" size={30} />,
		flash: <Flash className="text-primary" fill="currentColor" size={30} />,
		server: <Server className="text-success" fill="currentColor" size={30} />,
		user: <TagUser className="text-danger" fill="currentColor" size={30} />,
	}
	const[categories,setCategories]= useState("")
	const[search,setSearch]= useState("")
	const [selectedCategory, setSelectedCategory] = useState(null);

	const { user } = useSelector((state) => state.user)

	const dispatch = useDispatch()
	const router = useRouter()
	const pathname = usePathname()

	const queryClient = new QueryClient()
	const {
		data,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['categories'],
		queryFn: () => getAllCategoriesUser({page:1,count:10,query:''}),
		keepPreviousData: true,
	})
	useEffect(() => {
		if(data)
		{console.log(data)
3
			setCategories(data.categories)
		}
	  
	  }, [data])

	const handleLogout = async (e) => {
		try {
			const res = await queryClient.fetchQuery({
				queryFn: () => logoutUser('user'),
			})
			if (res?.success) {
				dispatch(logout())
                toast.success('Logged out successfully')
			} else toast.error('Something went wrong, please try again later')
		} catch (error) {
			toast.error('Something went wrong, please try again later')
		}
	}

	const handleHomeButton = () => {
		router.push('/')
	}
	const handleSearch = () => {
		router.push(`/search?search=${search}`)
	}
	  

	return (
		<Navbar maxWidth="xl">
			<div className="flex justify-center items-center gap-6">
				<NavbarContent as="div" className="items-center" justify="center">
					<Image
						src="/logo.svg"
						alt=""
						height={0}
                		width={0}
                		style={{width:'120px', height: "auto" }}
						priority={true}
						onClick={handleHomeButton}
						className="cursor-pointer"
					/>
				</NavbarContent>
				<NavbarContent as="div" className="items-center" justify="center">
					<Dropdown>
						<NavbarItem>
							<DropdownTrigger>
								<Button
									disableRipple
									className="p-0 bg-transparent data-[hover=true]:bg-transparent font-bold"
									endContent={icons.chevron}
									radius="sm"
									variant="light">
									Categories
								</Button>
							</DropdownTrigger>
						</NavbarItem>
						<DropdownMenu
								className="text-default-500"
								aria-label="course category selection"
								variant="flat"
								disallowEmptySelection
								selectionMode="single"
								>
								{categories &&
									categories.map((category) => (
										<DropdownItem key={category._id} description={category.description}>											
											<Link href={`/category/${category._id}`}>
                    						<a>{category.title}</a>
               								</Link>
										</DropdownItem>
									))}
							</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			</div>
			<NavbarContent as="div" className="items-center flex-grow max-w-[450px]" justify="center">
				<Input
					classNames={{
						base: 'max-w-full h-10',
						mainWrapper: 'h-full',
						input: 'text-small',
						inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
					}}
					placeholder="Search for courses..."
					size="sm"
					startContent={<SearchIcon size={18} />}
					type="search"
					onChange={(e)=>setSearch(e.target.value)}
				/>
				<Button onClick={handleSearch}>Search</Button>
			</NavbarContent>
			{user && user.role == 'user' ? (
				<div className="flex justify-center items-center gap-6">
					<NavbarContent >
					<Chat/>
					</NavbarContent>
					<NavbarContent className="hidden sm:flex gap-4" justify="center">
						<NavbarItem isActive>
							<Link as={NextLink} href="/my-courses" aria-current="page" size="sm">
								My Courses
							</Link>
						</NavbarItem>
					</NavbarContent>
					<NavbarContent as="div" className="items-center" justify="center">
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									isBordered
									as="button"
									className="transition-transform"
									color="#2D4059"
									name={user.email.slice(0, 1).toUpperCase()}
									size="sm"
									src={user.profileImage}
								/>
							</DropdownTrigger>
							<DropdownMenu aria-label="Profile Actions" variant="flat" className="text-default-500">
								<DropdownItem key="profile" className="h-14 gap-2">
									<p className="font-semibold text-sm">Signed in as</p>
									<p className="font-semibold">{user.email}</p>
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
					<NavbarContent as="div" className="hidden md:flex items-center" justify="center">
					<Link as={NextLink} href="/wishlist">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-check"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
					</Link>
					</NavbarContent>
				</div>
			) : (
				<NavbarContent as="div" className="items-center" justify="center">
					<NavbarItem className="flex">
						<Link
							href="/login"
							variant="flat"
							color="primary"
							className="font-bold"
							as={NextLink}
							size="sm">
							Login
						</Link>
					</NavbarItem>
				</NavbarContent>
			)}
		</Navbar>
	)
}
