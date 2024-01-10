'use client'
import React, { useEffect } from 'react'

import { getAllTeachers } from '@/api/users'

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Chip,
	Pagination,
	useDisclosure,
	Spinner,
	Spacer,
} from '@nextui-org/react'

const columns = [
	{ name: '', uid: 'profileImage', width: '50px' },
	{ name: 'NAME', uid: 'name', width: '210px' },
	{ name: 'EMAIL', uid: 'email', width: '200px' },
	{ name: 'ROLE', uid: 'role', width: '100px' },
	{ name: 'STATUS', uid: 'status', width: '100px' },
	{ name: 'ACTIONS', uid: 'actions', width: '100px' },
]

const statusOptions = [
	{ name: 'Active', uid: 'active' },
	{ name: 'Blocked', uid: 'blocked' },
	{ name: 'Pending', uid: 'pending' },
]

import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import BlockUserModal from './BlockUserModal'
import { AlertTriangle, MoreVertical, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const INITIAL_VISIBLE_COLUMNS = ['profileImage', 'role', 'email', 'status', 'actions']

const statusColorMap = {
	published: 'success',
	draft: 'warning',
	pending: 'danger',
}

export default function App() {
	const [page, setPage] = React.useState(1)
	const [users, setUsers] = React.useState([])
	const rowsPerPage = 4
	const [pages, setPages] = React.useState(0)

	const router = useRouter()

	const [filterValue, setFilterValue] = React.useState('')
	const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
		queryKey: ['users', { page, count: rowsPerPage, query: filterValue }],
		queryFn: () => getAllTeachers({ page, count: rowsPerPage, query: filterValue }),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (error) toast.error(error?.response?.data?.message || 'Error while fetching users')
	}, [error])

	useEffect(() => {
		if (data) setUsers(data.users)
		setPages(Math.ceil(data?.totalUsers / rowsPerPage))
	}, [data])

	const [selectedKeys, setSelectedKeys] = React.useState([])
	const [visibleColumns, setVisibleColumns] = React.useState(INITIAL_VISIBLE_COLUMNS)
	const [statusFilter, setStatusFilter] = React.useState('all')
	const [sortDescriptor, setSortDescriptor] = React.useState({})

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [currentUser, setCurrentUser] = React.useState({})
	const {
		isOpen: isOpenBlockUserModal,
		onOpen: onOpenBlockUserModal,
		onClose: onCloseBlockUserModal,
	} = useDisclosure()

	const hasSearchFilter = Boolean(filterValue)

	const headerColumns = React.useMemo(() => {
		if (visibleColumns === 'all') return columns

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
	}, [visibleColumns])

	const filteredItems = React.useMemo(() => {
		let filteredUsers = [...users]

		if (filterValue.trim()) {
			filteredUsers = filteredUsers.filter((user) => {
				return user.name.toLowerCase().includes(filterValue.toLowerCase())
			})
		}
		if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status))
		}
		return filteredUsers
	}, [users, filterValue, statusFilter])

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return filteredItems.slice(start, end)
	}, [page, filteredItems, rowsPerPage])

	const sortedItems = React.useMemo(() => {
		return [...items].sort((a, b) => {
			const first = a[sortDescriptor.column]
			const second = b[sortDescriptor.column]
			const cmp = first < second ? -1 : first > second ? 1 : 0

			return sortDescriptor.direction === 'descending' ? -cmp : cmp
		})
	}, [sortDescriptor, items])

	const renderCell = React.useCallback((user, columnKey) => {
		const cellValue = user[columnKey]

		switch (columnKey) {
			case 'profileImage':
				return <img src={user.profileImage} className="rounded-sm w-[30px] h-[30px]" />
			case 'name':
				return (
					<p className="text-bold capitalize w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
						{cellValue}
					</p>
				)
			case 'email':
				return (
					<p className="text-bold w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{cellValue}</p>
				)
			case 'status':
				return (
					<Chip className="capitalize text-[12px]" color={statusColorMap[user.status]} variant="flat">
						{cellValue}
					</Chip>
				)
			case 'actions':
				const disabledKeys = user.status === 'pending' ? ['block'] : []
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<MoreVertical className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu disabledKeys={disabledKeys} className="text-foreground-500">
								<DropdownItem
									key="block"
									onClick={() => {
										setCurrentUser(user)
										onOpenBlockUserModal()
									}}>
									{user.status === 'blocked' ? 'Unblock' : 'Block'}
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				)
			default:
				return cellValue
		}
	}, [])

	const onNextPage = React.useCallback(() => {
		if (page < pages) {
			setPage(page + 1)
		}
	}, [page, pages])

	const onPreviousPage = React.useCallback(() => {
		if (page > 1) {
			setPage(page - 1)
		}
	}, [page])

	const onRowsPerPageChange = React.useCallback((e) => {
		setPage(1)
	}, [])

	const onSearchChange = React.useCallback((value) => {
		if (value) {
			setFilterValue(value)
			setPage(1)
		} else {
			setFilterValue('')
		}
	}, [])

	const onClear = React.useCallback(() => {
		setFilterValue('')
		setPage(1)
	}, [])

	const topContent = React.useMemo(() => {
		return (
			<div className="flex justify-between gap-3 items-end">
				<Input
					isClearable
					className="w-full sm:max-w-[44%]"
					placeholder="Search for tutors..."
					startContent={<Search size={16} />}
					value={filterValue}
					onClear={() => onClear()}
					onValueChange={onSearchChange}
					size="sm"
				/>
			</div>
		)
	}, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, data, hasSearchFilter])

	const bottomContent = React.useMemo(() => {
		return (
			<div className="py-2 px-2 flex justify-between items-center">
				<div></div>
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={Math.ceil(data?.totalUsers / rowsPerPage || 1)}
					onChange={setPage}
				/>
				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage}>
						Previous
					</Button>
					<Button isDisabled={page === pages} size="sm" variant="flat" onPress={onNextPage}>
						Next
					</Button>
				</div>
			</div>
		)
	}, [selectedKeys, items.length, page, pages, hasSearchFilter])

	return (
		<div className="p-6">
			<div className="flex justify-start items-baseline gap-2">
				<span className="text-xl font-normal">Tutors</span>
				{isLoading || isRefetching && (
					<Spinner size="sm"></Spinner>
				) 
				// : (
				// 	<span className="text-tiny text-gray-600">{`(${data?.totalUsers || 'No'} items)`}</span>
				// )
			}
				{isError && <AlertTriangle color="#f00" />}
			</div>

			<Spacer y={2} />

			<Table
				removeWrapper
				aria-label="Example table with custom cells, pagination and sorting"
				isHeaderSticky
				bottomContent={bottomContent}
				bottomContentPlacement="outside"
				selectedKeys={selectedKeys}
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSelectionChange={setSelectedKeys}
				onSortChange={setSortDescriptor}
				selectionMode="single"
				// onRowAction={(key) => {
				// 	router.push(`/teacher/users/${key}`)
				// }}
			>
				<TableHeader columns={headerColumns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === 'actions' ? 'center' : 'start'}
							width={column.width}
							allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					className="border-1"
					emptyContent={isLoading ? <Spinner /> : <p>No items found</p>}
					items={filteredItems}
					isLoading={isLoading}>
					{(item) => (
						<TableRow key={item._id}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>
			<BlockUserModal isOpen={isOpenBlockUserModal} onClose={onCloseBlockUserModal} user={currentUser} refetch={refetch}/>
		</div>
	)
}
