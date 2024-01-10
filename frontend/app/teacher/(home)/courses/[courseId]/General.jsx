import { uploadThumbnail } from '@/api/courses'
import { getCategoriesForTeacher } from '@/api/categories'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Spacer,
	Spinner,
	Textarea,
} from '@nextui-org/react'
import { ChevronDown, ImagePlus } from 'lucide-react'
import React, { useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '@/redux/slices/courseSlice'

export default function General({ errors, setErrors }) {
	const displayImage = useRef()
	const imageInput = useRef()
	const levels = ['Beginner', 'Intermediate', 'Advanced']

	const { course } = useSelector((state) => state.course)
	const dispatch = useDispatch()

	const {
		data: categories,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategoriesForTeacher(),
		keepPreviousData: true,
	})

	const { isLoading: isLoadingCourseThumbnail, mutate: mutateCourseThumbnail } = useMutation({
		mutationFn: uploadThumbnail,
		onSuccess: (data) => {
			dispatch(add({ ...course, thumbnail: data.thumbnail }))
		},
		onError: (error) => {
			let message = error?.response?.data?.errors
			if (message) setErrors({ ...errors, thumbnail: message })
			else toast.error('Something went wrong')
		},
	})

	const handleImageChange = (e) => {
		e.preventDefault()
		const file = e.target.files[0]
		if (file) mutateCourseThumbnail({ courseId: course._id, file })
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 m-2">
			<div>
				<Textarea
					label="Description"
					labelPlacement="outside"
					placeholder="Tell your students about the course"
					value={course?.description || ''}
					classNames={{
						label: 'text-[14px] font-medium text-slate-700',
						description: 'text-tiny text-slate-500 text-start',
					}}
					minRows={6}
					onChange={(e) => {
						if (e.target.value.length > 300) return
						dispatch(add({ ...course, description: e.target.value }))
						setErrors({ ...errors, description: '' })
					}}
					errorMessage={errors?.description}
					description={`${course?.description?.length || 0}/300`}
				/>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					<div>
						<p className="text-[14px] font-medium text-slate-700 mt-4">Category</p>
						<Spacer y={1} />
						<Dropdown>
							<DropdownTrigger>
								<Button isLoading={isLoading} fullWidth variant="flat" endContent={<ChevronDown />}>
									{(categories &&
										Object.values(categories).find((category) => category._id == course?.category)
											?.title) ||
										'Select a category'}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								className="text-default-500"
								aria-label="course category selection"
								variant="flat"
								disallowEmptySelection
								selectionMode="single"
								onSelectionChange={(key) => {
									dispatch(add({ ...course, category: key.currentKey }))
									setErrors({ ...errors, category: '' })
								}}>
								{categories &&
									categories.map((category) => (
										<DropdownItem key={category._id} description={category.description}>
											{category.title}
										</DropdownItem>
									))}
							</DropdownMenu>
						</Dropdown>
						<p className="text-tiny text-danger mt-1">{errors?.category}</p>
					</div>

					<div>
						<p className="text-[14px] font-medium text-slate-700 mt-4">Difficulty Level</p>
						<Spacer y={1} />
						<Dropdown>
							<DropdownTrigger>
								<Button fullWidth variant="flat" endContent={<ChevronDown />}>
									{course?.level || 'Select a level'}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								className="text-default-500"
								aria-label="difficulty level selection"
								variant="flat"
								disallowEmptySelection
								selectionMode="single"
								onSelectionChange={(key) => {
									dispatch(add({ ...course, level: key.currentKey }))
									setErrors({ ...errors, level: '' })
								}}>
								{levels.map((level) => (
									<DropdownItem key={level}>{level}</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<p className="text-tiny text-danger mt-1">{errors?.level}</p>
					</div>
				</div>
			</div>
			<div>
				<p className="text-[14px] font-medium text-slate-700">Thumbnail</p>
				<Spacer y={1} />
				<div className="group/item relative cursor-pointer inline-block">
					<img
						ref={displayImage}
						width={300}
						height={200}
						alt="Course thumnail image"
						src={course?.thumbnail || '/placeholder-thumbnail.webp'}
						className="cursor-pointer w-[300px] rounded-lg"
					/>
					<div
						className="group/edit absolute inset-0 flex bg-black bg-opacity-30 rounded-lg justify-center items-center invisible shadow-sm group-hover/item:visible"
						onClick={() => imageInput.current.click()}>
						<ImagePlus color="#fff" size={36} />
					</div>
					<input
						type="file"
						ref={imageInput}
						name="image"
						className="hidden"
						onChange={handleImageChange}></input>
				</div>
				<p className="text-tiny text-danger mt-1">{errors?.thumbnail}</p>
				{isLoadingCourseThumbnail && <Spinner size="sm" />}
			</div>
		</div>
	)
}
