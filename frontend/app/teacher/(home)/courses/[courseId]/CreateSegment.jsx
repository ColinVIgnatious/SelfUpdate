import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	Card,
	CardBody,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spacer,
	Textarea,
	useDisclosure,
} from '@nextui-org/react'
import React, { use, useState } from 'react'
import MuxUpload from './MuxUpload'
import { FolderIcon } from 'lucide-react'
import { add } from '@/redux/slices/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createSegment } from '@/api/segments'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

export default function CreateSegment({ isOpen, onClose, chapter }) {
	const [errors, setErrors] = useState({})
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [uploadId, setUploadId] = useState('')
	const [attachments, setAttachments] = useState([])
	const dispatch = useDispatch()

	const { course } = useSelector((state) => state.course)

	const { isLoading: isLoading, mutate: mutateCreateSegment } = useMutation({
		mutationFn: createSegment,
		onSuccess: (data) => {
			onClose()
			const updatedChapter = {
				...chapter,
				segments: [...chapter.segments.filter((segment) => segment._id !== data._id), data],
			}

			const updatedCourse = {
				...course,
				chapters: [...course.chapters.filter((chapter) => chapter._id !== updatedChapter._id), updatedChapter],
			}

			dispatch(add(updatedCourse))
			toast.success('Segment created successfully')
		},
		onError: (error) => {
			let errors = error?.response?.data?.message
			toast.error(errors || 'Something went wrong')
		},
	})

	const handleCreateSegment = () => {
		if (!title) return setErrors({ ...errors, title: 'Title is required' })
		if (!description) return setErrors({ ...errors, description: 'Description is required' })
		if (!uploadId) return setErrors({ ...errors, video: 'Video is required' })
		// if (attachments.length === 0) return setErrors({ ...errors, attachments: 'Attachments are required' })

		mutateCreateSegment({ title, description, uploadId, chapterId: chapter._id })
	}

	return (
		<Modal isDismissable={false} size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-foreground-600">
							Create a new segment
						</ModalHeader>
						<ModalBody>
							<div className="p-4">
								<Input
									isClearable
									label="Segment Title"
									labelPlacement="outside"
									placeholder=" "
									className="w-full"
									onClear={() => onClear()}
									classNames={{
										inputWrapper: 'text-default-500',
										label: 'text-[14px] font-medium text-slate-700',
									}}
									onChange={(e) => {
										setTitle(e.target.value)
										setErrors({ ...errors, title: '' })
									}}
									errorMessage={errors?.title}
								/>
								<Spacer y={4} />
								<Textarea
									label="Description"
									labelPlacement="outside"
									placeholder=" "
									classNames={{
										label: 'text-[14px] font-medium text-slate-700',
										description: 'text-tiny text-slate-500 text-end',
									}}
									minRows={3}
									maxRows={3}
									onChange={(e) => {
										setDescription(e.target.value)
										setErrors({ ...errors, description: '' })
									}}
									errorMessage={errors?.description}
								/>
								<Spacer y={4} />
								<div className="w-max-[400px]">
									<h2 className="text-[14px] font-medium text-slate-700">
										Segment video<span className="ms-1 text-tiny text-danger">*</span>
									</h2>
									<Card className="mt-2">
										<CardBody>
											<MuxUpload
												setUploadId={setUploadId}
												errors={errors}
												setErrors={setErrors}
											/>
										</CardBody>
									</Card>
									<p className="text-tiny text-danger">{errors?.video}</p>
								</div>
								<Spacer y={4} />
								{/* <div>
									<p className="text-[14px] font-medium text-slate-700">Attachments</p>
									<label className="block mt-2">
										<input
											type="file"
											className="block w-full text-sm text-slate-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded-md file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-violet-50 file:text-slate-700
                                                            hover:file:bg-violet-100"
										/>
									</label>
								</div> */}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Cancel
							</Button>
							<Button isLoading={isLoading} variant="flat" color="primary" onPress={handleCreateSegment}>
								Add
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
