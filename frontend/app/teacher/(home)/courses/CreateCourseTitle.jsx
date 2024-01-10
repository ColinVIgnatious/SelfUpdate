import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
	Spacer,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { createCourse } from '@/api/courses'

export default function CreateCourseTitle({ isOpen, onClose }) {
	const [title, setTitle] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()

	const { isLoading: isLoadingCraeteCourse, mutate: mutateCraeteCourse } = useMutation({
		mutationFn: createCourse,
		onSuccess: (data) => {
			onClose()
			router.push(`/teacher/courses/${data?.course?._id}`)
		},
		onError: (error) => {
			const err = error?.response?.data?.errors?.title
			if (err) setError(err)
			else toast.error(error?.response?.data?.message || 'Something went wrong')
		},
	})

	const handleCourseTitle = () => {
		if (title === '') return setError('Please enter a title')
		mutateCraeteCourse({ course: { title }, selectedTab: 'title_only' })
	}

	return (
		<Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">Create a new course</h1>
								<p className="text-sm text-slate-600 mt-2">
									What would you like to name your course? Don&apos;t worry, you can change this
									later.
								</p>
								<Spacer y={4} />
								<Input
									isClearable
									label="Course Title"
									labelPlacement="outside"
									className="w-full"
									description="Title will be displayed on the course page and in search results."
									placeholder="e.g. 'Advanced web development'"
									onClear={() => onClear()}
									classNames={{
										inputWrapper: 'text-default-500',
									}}
									onChange={(e) => {
										setError('')
										setTitle(e.target.value)
									}}
									errorMessage={error}
									isInvalid={error ? true : false}
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="danger" variant="light" onPress={onClose} className="font-medium">
							Close
						</Button>
						<Button
							color="primary"
							onPress={handleCourseTitle}
							variant="flat"
							className="font-medium"
							isLoading={isLoadingCraeteCourse}>
							Continue
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	)
}
