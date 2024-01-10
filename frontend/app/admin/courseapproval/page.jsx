'use client'
import React, { useEffect } from 'react'

import { getPendingCourses } from '@/api/courses'

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
	{ name: '', uid: 'thumbnail', width: '1px' },
	{ name: 'TITLE', uid: 'title', width: '210px' },
	{ name: 'DESCRIPTION', uid: 'description', width: '200px' },
	{ name: 'STATUS', uid: 'status', width: '100px' },
	{ name: 'ACTIONS', uid: 'actions', width: '100px' },
]

const statusOptions = [
	{ name: 'Draft', uid: 'Draft' },
	{ name: 'Published', uid: 'Published' },
	{ name: 'Pending Approval', uid: 'Pending Approval' },
]

import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import ApproveCourse from './ApproveCourse'
import { AlertTriangle, MoreVertical, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const INITIAL_VISIBLE_COLUMNS = ['thumbnail', 'title', 'description', 'status', 'actions']

const statusColorMap = {
	Published: 'success',
	Draft: 'warning',
	'Pending Approval': 'danger',
}

export default function App() {
	const [page, setPage] = React.useState(1)
	const [courses, setCourses] = React.useState([])
	const rowsPerPage = 4
	const [pages, setPages] = React.useState(0)

	const router = useRouter()

	const [filterValue, setFilterValue] = React.useState('')
	const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
		queryKey: ['courses', { page, count: rowsPerPage, query: filterValue }],
		queryFn: () => getPendingCourses({ page, count: rowsPerPage, query: filterValue }),
		keepPreviousData: true,
	})
	useEffect(() => {
    console.log(data)
	
	  
	}, [data])
	

	useEffect(() => {
		if (error) toast.error(error?.response?.data?.message || 'Error while fetching courses')
	}, [error])

	useEffect(() => {
		if (data) setCourses(data.courses)
		setPages(Math.ceil(data?.totalCourses / rowsPerPage))
	}, [data])

	const [selectedKeys, setSelectedKeys] = React.useState([])
	const [visibleColumns, setVisibleColumns] = React.useState(INITIAL_VISIBLE_COLUMNS)
	const [statusFilter, setStatusFilter] = React.useState('all')
	const [sortDescriptor, setSortDescriptor] = React.useState({})

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [currentStatus, setCurrentStatus] = React.useState({})
	const {
		isOpen: isOpenApproveCourse,
		onOpen: onOpenApproveCourse,
		onClose: onCloseApproveCourse,
	} = useDisclosure()

	const hasSearchFilter = Boolean(filterValue)

	const headerColumns = React.useMemo(() => {
		if (visibleColumns === 'all') return columns

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
	}, [visibleColumns])

	const filteredItems = React.useMemo(() => {
		let filteredCourses = [...courses]

		if (filterValue.trim()) {
			filteredCourses = filteredCourses.filter((user) => {
				return user.name.toLowerCase().includes(filterValue.toLowerCase())
			})
		}
		if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
			filteredCourses = filteredCourses.filter((user) => Array.from(statusFilter).includes(course.status))
		}
		return filteredCourses
	}, [courses, filterValue, statusFilter])

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

	const renderCell = React.useCallback((course, columnKey) => {
		const cellValue = course[columnKey]

		switch (columnKey) {
			case 'thumbnail':
				return <img src={course.thumbnail} className="rounded-sm w-[30px] h-[30px]" />
			case 'title':
				return (
					<p className="text-bold capitalize w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
						{cellValue}
					</p>
				)
			case 'description':
				return (
					<p className="text-bold w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{cellValue}</p>
				)
			case 'status':
				return (
					<Chip className="capitalize text-[12px]" color={statusColorMap[course.status]} variant="flat">
						{cellValue}
					</Chip>
				)
			case 'actions':
				const disabledKeys = course.status === 'Pending Approval' ? ['block'] : []
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<MoreVertical className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu  className="text-foreground-500">
								<DropdownItem
									key="block"
									onClick={() => {
										setCurrentStatus(course)
										onOpenApproveCourse()
									}}>
									{course.status === 'Pending Approval' ? 'Publish' : 'UnPublish'}
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
					placeholder="Search for courses..."
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
					total={Math.ceil(data?.totalCourses / rowsPerPage || 1)}
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
				<span className="text-xl font-normal">Courses</span>
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
			{/* <BlockUserModal isOpen={isOpenBlockUserModal} onClose={onCloseBlockUserModal} user={currentUser} refetch={refetch}/> */}
			<ApproveCourse isOpen={isOpenApproveCourse} onClose={onCloseApproveCourse} course={currentStatus} refetch={refetch}/>
		</div>
	)
}
