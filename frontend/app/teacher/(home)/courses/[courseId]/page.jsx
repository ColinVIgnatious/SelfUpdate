'use client'

import { createCourse, getCourse } from '@/api/courses'
import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Spacer,
	Spinner,
	Tab,
	Tabs,
} from '@nextui-org/react'
import { DollarSign, MoreVertical, Newspaper, Package } from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { QueryClient, useMutation, useQuery } from 'react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import General from './General'
import Content from './Content'
import Pricing from './Pricing'
import { add } from '@/redux/slices/courseSlice'

export default function Page({ params: { courseId } }) {
	const dispatch = useDispatch()
	const [TabError, setTabError] = useState({ general: 0, content: 0, pricing: 0 })
	const [saveButtonTitle, setSaveButtonTitle] = useState('Next')
	const [selectedTab, setSelectedTab] = React.useState('general')
	const { course } = useSelector((state) => state.course)
    const router = useRouter()

	const [errors, setErrors] = useState({
		general: {
			title: null,
			description: null,
			category: null,
			level: null,
			thumbnail: null,
		},
		content: {
			video: null,
		},
		pricing: {
			price: null,
			mrp: null,
		},
	})

	const queryClient = new QueryClient()

	const { data, isLoading, isError } = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => getCourse(courseId),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (data) dispatch(add({...data.course,category:data?.course?.category?._id}))
	}, [data])

	const { isLoading: isLoadingCraeteCourse, mutate: mutateCraeteCourse } = useMutation({
		mutationFn: createCourse,
		onSuccess: (data) => {
			queryClient.setQueryData(['course'], data)
			if (selectedTab === 'general') setSelectedTab('content')
			if (selectedTab === 'pricing') {
				toast.success('Course created successfully')
                router.push('/teacher/courses')
			}
		},
		onError: (error) => {
			setErrors(error?.response?.data?.errors)
		},
	})

	useEffect(() => {
		if (errors?.toast) {
			toast.error(errors?.toast)
			setErrors({ ...errors, toast: '' })
		}
	}, [errors])

	const handleCraeteCourse = async () => {
		let errors = {}

		if (selectedTab === 'general') {
			if (course?.title?.length < 5) errors.title = 'Title must be atleast 5 characters long'
			if (!course?.description) errors.description = 'Description is required'
			else if (course?.description?.length < 30)
				errors.description = 'Description must be atleast 30 characters long'
			if (!course?.category) errors.category = 'Select a category from the list'
			if (!course?.level) errors.level = 'Select a level from the list'
			if (!course?.thumbnail) errors.thumbnail = 'Select a image for the course'

			for (const item in errors) {
				if (errors[item]) return setErrors(errors)
			}
			mutateCraeteCourse({ course, selectedTab })
		} else if (selectedTab === 'content') {
			if (course?.chapters?.length === 0)
				return setErrors({ ...errors, content: 'Add atleast one chapter to the course' })
			else {
				for (const chapter of course?.chapters) {
					if (chapter?.videos?.length === 0)
						return setErrors({ ...errors, content: 'Add atleast one video to the chapter' })
				}
			}
			setSelectedTab('pricing')
			setSaveButtonTitle('Publish')
		} else if (selectedTab === 'pricing') {
			if (!course?.price) errors.price = 'Price is required'
			else if (course?.price < 0) errors.price = 'Price must be greater than 0'
			else if (course?.price && !parseInt(course?.price)) errors.price = 'Price must be a number'

			if (!course?.mrp) errors.mrp = 'MRP is required'
			else if (course?.mrp < 0) errors.mrp = 'MRP must be greater than 0'
			else if (course?.mrp && !parseInt(course?.mrp)) errors.mrp = 'MRP must be a number'
			if (course?.price && course?.mrp && parseInt(course?.price) > parseInt(course?.mrp))
				errors.price = 'Price must be less than MRP'

			mutateCraeteCourse({ course, selectedTab })
		}
	}

	return (
		<div className="p-6">
			<div className="flex items-center gap-3">
				<Input
					variant="flat"
					size="sm"
					value={course?.title || ''}
					onChange={(e) => {
						dispatch(add({ ...course, title: e.target.value }))
						setErrors({ ...errors, title: '' })
					}}
					classNames={{
						input: 'text-[1.4rem] font-semibold',
						inputWrapper: 'bg-transparent shadow-none',
					}}
					placeholder={'Whats the title of your course ?'}
					isInvalid={errors?.title ? true : false}
				/>
				{isLoading && <Spinner size="sm" />}
				<div className="hidden md:flex justify-center items-center gap-2">
					<Button
						auto
						size="md"
						variant="light"
						className="ml-auto"
						onClick={() => {
							handleCraeteCourse()
						}}>
						Save as Draft
					</Button>
					<Button
						auto
						isLoading={isLoadingCraeteCourse}
						size="md"
						variant="flat"
						className="ml-auto"
						onClick={() => {
							handleCraeteCourse()
						}}>
						{saveButtonTitle}
					</Button>
				</div>
				<div className="md:hidden">
					<Dropdown>
						<DropdownTrigger>
							<MoreVertical />
						</DropdownTrigger>
						<DropdownMenu aria-label="user actions" className="text-default-500">
							<DropdownItem key="draft">Save as Draft</DropdownItem>
							<DropdownItem
								key="save"
								onClick={() => {
									handleCraeteCourse()
								}}>
								Save
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<Spacer y={1} />
			<Tabs
				variant="underlined"
				aria-label="Tabs variants"
				selectedKey={selectedTab}
				onSelectionChange={setSelectedTab}>
				<Tab
					key="general"
					title={
						<div className="flex items-center space-x-2">
							<Newspaper size={16} />
							<span>General</span>
							{TabError?.general > 0 && (
								<Chip size="sm" color="danger" className="h-auto">
									<p className="text-[10px]">{TabError?.general}</p>
								</Chip>
							)}
						</div>
					}>
					<General errors={errors} setErrors={setErrors} />
				</Tab>
				<Tab
					key="content"
					title={
						<div className="flex items-center space-x-2">
							<Package size={16} />
							<span>Content</span>
							{TabError?.content > 0 && (
								<Chip size="sm" color="danger" className="h-auto">
									<p className="text-[10px]">{TabError?.content}</p>
								</Chip>
							)}
						</div>
					}>
					<Content errors={errors} setErrors={setErrors} />
				</Tab>
				<Tab
					key="pricing"
					title={
						<div className="flex items-center space-x-2">
							<DollarSign size={16} />
							<span>Pricing</span>
							{TabError?.pricing > 0 && (
								<Chip size="sm" color="danger" className="h-auto">
									<p className="text-[10px]">{TabError?.pricing}</p>
								</Chip>
							)}
						</div>
					}>
					<Pricing errors={errors} setErrors={setErrors} />
				</Tab>
			</Tabs>
		</div>
	)
}
