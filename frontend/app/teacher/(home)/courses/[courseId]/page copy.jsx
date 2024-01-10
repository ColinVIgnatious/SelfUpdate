'use client'

import { createCourse, getCourse } from '@/api/courses'
import { Button, Chip, Input, Spacer, Tab, Tabs } from '@nextui-org/react'
import { DollarSign, Newspaper, Package } from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { QueryClient, useMutation, useQuery } from 'react-query'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import General from './General'
import Content from './Content'
import Pricing from './Pricing'
import { add } from '@/redux/slices/courseSlice'

export default function Page() {
	const [general, setGeneral] = useState({})
	const [content, setContent] = useState({})
	const [pricing, setPricing] = useState({})
	const [courseId, setCourseId] = useState('')

    const dispatch = useDispatch()

	const [TabError, setTabError] = useState({ general: 0, content: 0, pricing: 0 })

	const searchParams = useSearchParams()
	useEffect(() => {
		if (searchParams.get('title')) setGeneral({ ...general, title: searchParams.get('title') })
		if (searchParams.get('id')) setCourseId(searchParams.get('id'))
	}, [])

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

	const {
		data: course,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => getCourse(courseId),
		keepPreviousData: true,
	})

    useEffect(() => {
        dispatch(add(course))
        console.log(course)
        if (course) {
            setGeneral({
                title: course?.title,
                description: course?.description,
                category: course?.category?._id,
                level: course?.level,
                thumbnail: course?.thumbnail,
            })
            setContent(course?.chapters)
            setPricing({
                price: course?.price,
                mrp: course?.mrp,
            })
        }
    }, [course])

	const { isLoading: isLoadingCraeteCourse, mutate: mutateCraeteCourse } = useMutation({
		mutationFn: createCourse,
		onSuccess: (data) => {
			queryClient.setQueryData(['course'], data)
			toast.success('Course created successfully')
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

	useEffect(() => {
		const errorCount = {}
		for (const item in errors) {
			errorCount[item] = 0
			for (const el in errors[item]) {
				if (errors[item][el]) errorCount[item]++
			}
		}
		setTabError(errorCount)
	}, [errors])

	const handleCraeteCourse = async () => {
		let errors = {
			general: {},
			content: {},
			pricing: {},
		}

		if (general?.title?.length < 5) errors.general.title = 'Title must be atleast 5 characters long'
		if (!general?.description) errors.general.description = 'Description is required'
		else if (general?.description?.length < 30)
			errors.general.description = 'Description must be atleast 30 characters long'
		if (!general?.category) errors.general.category = 'Select a category from the list'
		if (!general?.level) errors.general.level = 'Select a level from the list'
		if (!general?.image) errors.general.image = 'Select a image for the course'

		if (!pricing.price) errors.pricing.price = 'Price is required'
		else if (pricing?.price < 0) errors.pricing.price = 'Price must be greater than 0'
		else if (pricing?.price && !parseInt(pricing?.price)) errors.pricing.price = 'Price must be a number'

		if (!pricing.mrp) errors.pricing.mrp = 'MRP is required'
		else if (pricing?.mrp < 0) errors.pricing.mrp = 'MRP must be greater than 0'
		else if (pricing?.mrp && !parseInt(pricing?.mrp)) errors.pricing.mrp = 'MRP must be a number'
		if (pricing?.price && pricing?.mrp && parseInt(pricing?.price) > parseInt(pricing?.mrp))
			errors.pricing.price = 'Price must be less than MRP'

		for (const item in errors) {
			for (const el in errors[item]) {
				if (errors[item][el]) return setErrors(errors)
			}
		}

		mutateCraeteCourse({ title, description, category, level, price, mrp, uploadId, image })
	}

	return (
		<div className="p-6">
			<div className="flex items-baseline gap-3">
				<Input
					variant="flat"
					size="sm"
					value={general?.title}
					onChange={(e) => {
						setGeneral({ ...general, title: e.target.value })
						setErrors({ ...errors, general: { ...errors.general, title: '' } })
					}}
					classNames={{
						input: 'text-[1.4rem] font-semibold',
						inputWrapper: 'bg-transparent shadow-none',
					}}
					placeholder={'Whats the title of your course ?'}
					isInvalid={errors?.general?.title ? true : false}
				/>
				<Button
					auto
					isLoading={isLoadingCraeteCourse}
					size="md"
					variant="light"
					className="ml-auto"
					onClick={() => {
						handleCraeteCourse()
					}}>
					Save changes
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
					Publish
				</Button>
			</div>
			<Spacer y={1} />
			<Tabs variant="underlined" aria-label="Tabs variants">
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
					<General general={general} setGeneral={setGeneral} errors={errors} setErrors={setErrors} />
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
					<Content content={content} setContent={setContent} errors={errors} setErrors={setErrors} />
				</Tab>
				<Tab
					key="price"
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
					<Pricing pricing={pricing} setPricing={setPricing} errors={errors} setErrors={setErrors} />
				</Tab>
			</Tabs>
		</div>
	)
}
