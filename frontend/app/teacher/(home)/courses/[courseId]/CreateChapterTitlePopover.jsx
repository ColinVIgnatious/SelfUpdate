import React, { use, useEffect, useRef, useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent, Button, Input, Spacer, popover } from '@nextui-org/react'
import { FolderPlus } from 'lucide-react'
import { createChapter } from '@/api/chapters'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '@/redux/slices/courseSlice'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

export default function CreateChapterTitlePopover() {
	const { course } = useSelector((state) => state.course)
	const [title, setTitle] = useState('')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const popoverTrigger = useRef()
	const { isLoading: isLoading, mutate: mutateCreateChapter } = useMutation({
		mutationFn: createChapter,
		onSuccess: (data) => {
            console.log(data)
			if (data) dispatch(add({ ...course, chapters: [...course.chapters, data] }))
			popoverTrigger.current.click()
		},
		onError: (error) => {
			let errors = error?.response?.data?.message
			popoverTrigger.current.click()
			toast.error(errors || 'Something went wrong')
		},
	})

	return (
		<Popover placement="right" showArrow offset={-80} backdrop="opaque">
			<PopoverTrigger>
				<div className="flex items-center gap-2 opacity-50 cursor-pointer" ref={popoverTrigger}>
					<FolderPlus size={18} />
					<p className="text-sm font-normal underline">Add a chapter</p>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-[400px]">
				{() => (
					<div className="px-1 py-2 w-full">
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">Create a new chapter</h1>

								<Spacer y={4} />
								<Input
									isClearable
									label="Chapter Title"
									labelPlacement="outside"
									className="w-full"
									placeholder="e.g. 'Basics of React'"
									onClear={() => onClear()}
									classNames={{
										inputWrapper: 'text-default-500',
									}}
									description="Short and descriptive titles work best."
									onChange={(e) => {
										setTitle(e.target.value)
										setError('')
									}}
									errorMessage={error}
									isInvalid={error ? true : false}
								/>
							</div>
						</div>
						<Spacer y={8} />
						<div className="flex justify-end items-center gap-2">
							<Button
								color="danger"
								variant="light"
								className="font-medium"
								onClick={() => popoverTrigger.current.click()}>
								Close
							</Button>
							<Button
								isLoading={isLoading}
								color="primary"
								variant="flat"
								className="font-medium"
								onClick={() => {
									if (title.trim() === '') return setError('Title cannot be empty')
									else mutateCreateChapter({ title, courseId: course._id })
								}}>
								Continue
							</Button>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
