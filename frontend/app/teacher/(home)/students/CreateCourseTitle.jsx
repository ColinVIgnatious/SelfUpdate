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

export default function CreateCourseTitle({ isOpen, onClose }) {
	const [title, setTitle] = useState('')
	const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const handleCourseTitle = () => {
		if (title === '') {
			return setError('Please enter a title')
		}
        setIsLoading(true)
		router.push(`/teacher/courses/create/?title=${title}`)
	}
	return (
		<Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">Create a new Course</h1>
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
						<Button color="primary" onPress={handleCourseTitle} variant="flat" className="font-medium" isLoading={isLoading}>
							Continue
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	)
}
