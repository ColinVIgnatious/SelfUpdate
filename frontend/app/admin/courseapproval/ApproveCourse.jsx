import React, { useEffect } from 'react'
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button
} from '@nextui-org/react'
import { changeCourseStatus } from '@/api/courses'
import { useMutation, useQueryClient } from 'react-query'

export default function ApproveCourse({ isOpen, onClose, course }) {
	const queryClient = useQueryClient()
	const { isLoading, mutate } = useMutation({
		mutationFn: changeCourseStatus,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['courses'] })
			onClose()
		},
		onError: (error) => {
			const err = error?.response?.data?.message || 'Something went wrong'
			toast.error(err)
			onClose(false)
		},
	})

	const handleCourseDelete = (status) => {
		mutate({ id: course._id, status })
	}

	return (
		<Modal isDismissable={false} backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">
									{course.status === 'Pending Approval' ? 'Publish' : 'Unpublish'}the course
								</h1>
								<p className="text-sm text-slate-600 mt-2">
									Are you sure you want to {course.status === 'Pending Approval' ? 'Publish' : 'Unpublish'} this
									course?
								</p>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button isDisabled={isLoading} variant="light" onPress={onClose} className="font-medium">
							Cancel
						</Button>
						<Button
							color="danger"
							onPress={() => handleCourseDelete(course.status === 'Pending Approval' ? 'Publish' : 'Unpublish')}
							variant="flat"
							className="font-medium"
							isLoading={isLoading}>
							{course.status === 'Pending Approval' ? 'Publish' : 'Unpublish'}
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	)
}
