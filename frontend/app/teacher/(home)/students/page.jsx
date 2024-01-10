'use client'
import React, { useEffect } from 'react'

import { getUsersOfTeacher } from '@/api/users'

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
	User,
	Pagination,
	useDisclosure,
} from '@nextui-org/react'

const columns = [
	{ name: 'ID', uid: '_id' },
	{ name: 'NAME', uid: 'name' },
	{ name: 'ROLE', uid: 'role' },
	{ name: 'METHOD', uid: 'method' },
	{ name: 'EMAIL', uid: 'email' },
	{ name: 'STATUS', uid: 'status' },
	{ name: 'ACTIONS', uid: 'actions' },
]

const statusOptions = [
	{ name: 'active', uid: 'active' },
	{ name: 'blocked', uid: 'Blocked' },
	{ name: 'pending', uid: 'pending' },
]

import { PlusIcon } from './PlusIcon'
import { VerticalDotsIcon } from './VerticalDotsIcon'
import { ChevronDownIcon } from './ChevronDownIcon'
import { SearchIcon } from './SearchIcon'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'
import CreateCourseTitle from './CreateCourseTitle'

const INITIAL_VISIBLE_COLUMNS = ['name', 'method', 'role', 'status', 'actions']

const statusColorMap = {
	active: 'success',
	blocked: 'danger',
	pending: 'warning',
}

export default function App() {
	const [page, setPage] = React.useState(1)
	const count = 8
	const [users, setUsers] = React.useState([])

	const { data, isLoading } = useQuery({
		queryKey: ['users', { page, count }],
		queryFn: () => getUsersOfTeacher({ page, count }),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (data) setUsers(data.users)
	}, [data])

	useEffect(() => {
		console.log(isLoading)
	}, [isLoading])

	const [filterValue, setFilterValue] = React.useState('')
	const [selectedKeys, setSelectedKeys] = React.useState([])
	const [visibleColumns, setVisibleColumns] = React.useState(INITIAL_VISIBLE_COLUMNS)
	const [statusFilter, setStatusFilter] = React.useState('all')
	const [rowsPerPage, setRowsPerPage] = React.useState(5)
	const [sortDescriptor, setSortDescriptor] = React.useState({
		column: 'age',
		direction: 'ascending',
	})
	const { isOpen, onOpen, onClose } = useDisclosure()

	const hasSearchFilter = Boolean(filterValue)

	const headerColumns = React.useMemo(() => {
		if (visibleColumns === 'all') return columns

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
	}, [visibleColumns])

	const filteredItems = React.useMemo(() => {
		let filteredUsers = [...users]

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(filterValue.toLowerCase()))
		}
		if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status))
		}

		return filteredUsers
	}, [users, filterValue, statusFilter])

	const pages = Math.ceil(filteredItems.length / rowsPerPage)

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
			case 'name':
				return (
					<User
						avatarProps={{ radius: 'full', src: user.profileImage }}
						description={user.email}
						name={cellValue}>
						{user.email}
					</User>
				)
			case 'role':
				return (
					<div className="flex flex-col">
						<p className="text-bold text-tiny capitalize">{cellValue}</p>
					</div>
				)
			case 'method':
				return (
					<div className="flex flex-col">
						<p className="text-bold text-tiny capitalize">{cellValue}</p>
					</div>
				)
			case 'status':
				return (
					<Chip className="capitalize text-[12px]" color={statusColorMap[user.status]} variant="flat">
						{cellValue}
					</Chip>
				)
			case 'actions':
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<VerticalDotsIcon className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem>View</DropdownItem>
								<DropdownItem>Edit</DropdownItem>
								<DropdownItem>Delete</DropdownItem>
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
		setRowsPerPage(Number(e.target.value))
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
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Search by name..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
						size="md"
					/>
					<div className="flex gap-3"></div>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-default-400 text-small">Total {data?.totalUsers} users</span>
				</div>
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
					total={Math.ceil(data?.DropdownItemtotalUsers / count || 1)}
					onChange={setPage}
				/>
				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
						Previous
					</Button>
					<Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
						Next
					</Button>
				</div>
			</div>
		)
	}, [selectedKeys, items.length, page, pages, hasSearchFilter])

	const handleOpenCourseCreateModal = () => {
		setOpenCourseCreateModal(true)
	}

	return (
		<>
			<Table
				removeWrapper
				className="p-6"
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
				onRowAction={(key) => toast.success(`${key}`)}>
				<TableHeader columns={headerColumns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === 'actions' ? 'center' : 'start'}
							allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={users} isLoading={isLoading} loadingContent={<p>Loading...</p>}>
					{(item) => (
						<TableRow key={item._id}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>
			<CreateCourseTitle isOpen={isOpen} onClose={onClose} />
		</>
	)
}
