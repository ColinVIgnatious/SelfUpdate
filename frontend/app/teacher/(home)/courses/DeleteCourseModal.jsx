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
import { useState } from 'react'
import { deleteCourse } from '@/api/courses'
import { useMutation, useQueryClient } from 'react-query'

export default function DeleteCourseModal({ isOpen, onClose, courseId }) {

    const queryClient = useQueryClient()
    const { isLoading, mutate } = useMutation({
        mutationFn: deleteCourse,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            onClose(false)
        },
        onError: (error) => {
            const err = error?.response?.data?.message || 'Something went wrong'
            toast.error(err)
            onClose(false)
        },
    })

	const handleCourseDelete = () => {
		mutate(courseId)
	}

	return (
		<Modal isDismissable={false} backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">Delete the course</h1>
								<p className="text-sm text-slate-600 mt-2">
									Are you sure you want to delete this course?
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
							onPress={handleCourseDelete}
							variant="flat"
							className="font-medium"
							isLoading={isLoading}>
							Delete
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	)
}
