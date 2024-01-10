import React, { useEffect } from 'react'
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { deleteCategory } from '@/api/categories'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

export default function DeleteCategoryModal({ isOpen, onClose, category }) {
	const queryClient = useQueryClient()
	const { isLoading, mutate } = useMutation({
		mutationFn: deleteCategory,
		onSuccess: (data) => {
            toast.success( 'Category deleted')
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			onClose()
		},
		onError: (error) => {
            console.log(error)
			const err = error?.response?.data?.message || 'Something went wrong'
			toast.error(err)
			onClose(false)
		}
	})

	const handleCategoryDelete = () => {
            mutate(category._id)
	}

	return (
		<Modal isDismissable={false} backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">Delete the category</h1>
								<p className="text-sm text-slate-600 mt-2">
									Are you sure you want to delete this category?
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
							onPress={() => handleCategoryDelete()}
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
