'use client'
import React, { useEffect } from 'react'

import { getAllCategories } from '@/api/categories'

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
	{ name: 'Listed', uid: 'listed' },
	{ name: 'Unlisted', uid: 'unlisted' },
]

import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import ChangeCategoryStatusModal from './ChangeCategoryStatusModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import { AlertTriangle, MoreVertical, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'

const INITIAL_VISIBLE_COLUMNS = ['thumbnail', 'title', 'description', 'status', 'actions']

const statusColorMap = {
	listed: 'success',
	unlisted: 'warning',
}

export default function App() {
	const [page, setPage] = React.useState(1)
	const [categories, setCategories] = React.useState([])
	const rowsPerPage = 8
	const [pages, setPages] = React.useState(0)

	const router = useRouter()

	const [filterValue, setFilterValue] = React.useState('')
	const { data, isLoading, isError, error, isRefetching } = useQuery({
		queryKey: ['categories', { page, count: rowsPerPage, query: filterValue }],
		queryFn: () => getAllCategories({ page, count: rowsPerPage, query: filterValue }),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (error) toast.error(error?.response?.data?.message || 'Error while fetching categories')
	}, [error])

	useEffect(() => {
		if (data) setCategories(data.categories)
		setPages(Math.ceil(data?.totalCategories / rowsPerPage))
	}, [data])

	const [selectedKeys, setSelectedKeys] = React.useState([])
	const [visibleColumns, setVisibleColumns] = React.useState(INITIAL_VISIBLE_COLUMNS)
	const [statusFilter, setStatusFilter] = React.useState('all')
	const [sortDescriptor, setSortDescriptor] = React.useState({})

	const [currentCategory, setCurrentCategory] = React.useState({})

	const {
		isOpen: isOpenBlockCategoryModal,
		onOpen: onOpenBlockCategoryModal,
		onClose: onCloseBlockCategoryModal,
	} = useDisclosure()

	const {
		isOpen: isOpenDeleteCategoryModal,
		onOpen: onOpenDeleteCategoryModal,
		onClose: onCloseDeleteCategoryModal,
	} = useDisclosure()

	const {
		isOpen: isOpenAddCategoryModal,
		onOpen: onOpenAddCategoryModal,
		onClose: onCloseAddCategoryModal,
	} = useDisclosure()

	const {
		isOpen: isOpenEditCategoryModal,
		onOpen: onOpenEditCategoryModal,
		onClose: onCloseEditCategoryModal,
	} = useDisclosure()

	const hasSearchFilter = Boolean(filterValue)

	const headerColumns = React.useMemo(() => {
		if (visibleColumns === 'all') return columns

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
	}, [visibleColumns])

	const filteredItems = React.useMemo(() => {
		let filteredCategories = [...categories]

		if (filterValue.trim()) {
			filteredCategories = filteredCategories.filter((category) => {
				return category.title.toLowerCase().includes(filterValue.toLowerCase())
			})
		}
		if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
			filteredCategories = filteredCategories.filter((category) =>
				Array.from(statusFilter).includes(category.status)
			)
		}
		return filteredCategories
	}, [categories, filterValue, statusFilter])

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

	const renderCell = React.useCallback((category, columnKey) => {
		const cellValue = category[columnKey]

		switch (columnKey) {
			case 'thumbnail':
				// return <img src={category.profileImage} className="rounded-sm w-[30px] h-[30px]" />
				return <></>
			case 'title':
			case 'description':
				return (
					<p className="text-bold capitalize w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
						{cellValue}
					</p>
				)
			case 'status':
				return (
					<Chip className="capitalize text-[12px]" color={statusColorMap[category.status]} variant="flat">
						{cellValue}
					</Chip>
				)
			case 'actions':
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<MoreVertical className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu className="text-foreground-500">
								<DropdownItem
									key="edit"
									onClick={() => {
										setCurrentCategory(category)
										onOpenEditCategoryModal()
									}}>
									Edit
								</DropdownItem>
								<DropdownItem
									key="block"
									onClick={() => {
										setCurrentCategory(category)
										onOpenBlockCategoryModal()
									}}>
									{category.status === 'listed' ? 'Unlist' : 'List'}
								</DropdownItem>
								<DropdownItem
									key="delete"
									onClick={() => {
										setCurrentCategory(category)
										onOpenDeleteCategoryModal()
									}}>
									Delete
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
					placeholder="Search for categories..."
					startContent={<Search size={16} />}
					value={filterValue}
					onClear={() => onClear()}
					onValueChange={onSearchChange}
					size="sm"
				/>
				<Button
					className="px-4 font-bold"
					color="primary"
					variant="flat"
					size="md"
					onClick={onOpenAddCategoryModal}>
					Add Category
				</Button>
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
					total={Math.ceil(data?.totalCategories / rowsPerPage || 1)}
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
				<span className="text-xl font-normal">Categories</span>
				{isLoading || isRefetching ? (
					<Spinner size="sm"></Spinner>
				) : (
					<span className="text-tiny text-gray-600">{`(${data?.totalCategories || 'No'} items)`}</span>
				)}
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
				onRowAction={(key) => {
					setCurrentCategory(categories.find(category=>category._id === key))
                    onOpenEditCategoryModal()
				}}>
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
			<ChangeCategoryStatusModal
				isOpen={isOpenBlockCategoryModal}
				onClose={onCloseBlockCategoryModal}
				category={currentCategory}
			/>
			<DeleteCategoryModal
				isOpen={isOpenDeleteCategoryModal}
				onClose={onCloseDeleteCategoryModal}
				category={currentCategory}
			/>
			<AddCategoryModal isOpen={isOpenAddCategoryModal} onClose={onCloseAddCategoryModal} />
			<EditCategoryModal
				isOpen={isOpenEditCategoryModal}
				onClose={onCloseEditCategoryModal}
				category={currentCategory}
			/>
		</div>
	)
}
