import React, { useEffect } from 'react'
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button
} from '@nextui-org/react'
import { changeCategoryStatus } from '@/api/categories'
import { useMutation, useQueryClient } from 'react-query'

export default function ChangeCategoryStatusModal({ isOpen, onClose, category }) {
	const queryClient = useQueryClient()
	const { isLoading, mutate } = useMutation({
		mutationFn: changeCategoryStatus,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			onClose()
		},
		onError: (error) => {
			const err = error?.response?.data?.message || 'Something went wrong'
			toast.error(err)
			onClose(false)
		},
	})

	const handleChangeCategoryStatus = (status) => {
		mutate({ id: category._id, status })
	}

	return (
		<Modal isDismissable={false} backdrop="opaque" isOpen={isOpen} onClose={onClose} closeButton={<></>}>
			<ModalContent>
				<>
					<ModalBody>
						<div className="mt-4">
							<div>
								<h1 className="text-large text-foreground-600 font-bold">
									{category.status === 'listed' ? 'Unlist ' : 'List '}the category
								</h1>
								<p className="text-sm text-slate-600 mt-2">
									Are you sure you want to {category.status === 'listed' ? 'unlist ' : 'list '} this
									category?
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
							onPress={() => handleChangeCategoryStatus(category.status === 'unlisted' ? 'listed' : 'unlisted')}
							variant="flat"
							className="font-medium"
							isLoading={isLoading}>
							{category.status === 'listed' ? 'Unlist ' : 'List '}
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	)
}
