import React, { useState } from 'react'
import { BreadcrumbItem, Breadcrumbs, Button, Spacer } from '@nextui-org/react'
import { Folder, FolderIcon, GripVertical, HomeIcon } from 'lucide-react'
import SegmentTable from './SegmentTable'
import CreateChapterTitlePopover from './CreateChapterTitlePopover'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '@/redux/slices/courseSlice'
import toast from 'react-hot-toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import CreateSegment from './CreateSegment'
import { deleteChapter } from '@/api/chapters'

export default function Content() {
	const { course } = useSelector((state) => state.course)
	const [chapter, setChapter] = useState(course?.chapters[0] || {})
	const dispatch = useDispatch()

	const [openCreateSegment, setOpenCreateSegment] = useState(false)

	const handleChapterEdit = (index, id) => {
		setChapter(course?.chapters[index])
	}

	const { isLoading: isLoadingDeleteChapter, mutate: mutateDeleteChapter } = useMutation({
		mutationFn: deleteChapter,
		onSuccess: (data) => {
			dispatch(add({ ...course, chapters: course.chapters.filter((chapter) => chapter._id !== data._id) }))
			toast.success('Chapter deleted')
			setChapter(course?.chapters[0])
		},
		onError: (error) => {
			let errors = error?.response?.data?.message
			toast.error(errors || 'Something went wrong')
		},
	})

	const handleDeleteChapter = () => {
		mutateDeleteChapter(chapter._id)
        setChapter(course?.chapters[0])
	}

	return (
		<div className="flex ms-1">
			<div className="w-[240px]">
				<Spacer y={2} />
				<p className="text-base">Chapters</p>
				<Spacer y={4} />
				{course &&
					course?.chapters?.map((item, index) => (
						<div key={index}>
							<div className="flex justify-between items-center me-4">
								<div
									className="flex items-center gap-2 cursor-pointer"
									onClick={() => handleChapterEdit(index, item._id)}>
									<Folder size={18} strokeWidth={`${item._id === chapter._id ? 2.5 : 2}`} />
									<p
										className={`w-[180px] text-[14px] select-none whitespace-nowrap overflow-hidden text-ellipsis ${
											item._id === chapter._id ? 'font-bold' : 'font-normal'
										}`}>
										{item.title}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<GripVertical className="cursor-pointer" size={20} />
								</div>
							</div>
							<Spacer y={6} />

						</div>
					))}
				<CreateChapterTitlePopover courseId={course?._id} />
			</div>
			<div className="w-[1px] min-h-[400px] bg-slate-200 mt-8"></div>
			<Spacer x={6} />
			<div className="flex-grow pt-8">
				<div className="flex justify-between items-center">
					<Breadcrumbs>
						<BreadcrumbItem startContent={<HomeIcon size={12} />}></BreadcrumbItem>
						<BreadcrumbItem>{chapter.title}</BreadcrumbItem>
					</Breadcrumbs>
					<Button isLoading={isLoadingDeleteChapter} size="small" color="error" onClick={handleDeleteChapter}>
						Delete
					</Button>
				</div>
				<Spacer y={4} />
				<ErrorBoundary>
					{chapter && <SegmentTable chapterId={chapter._id} setOpenCreateSegment={setOpenCreateSegment} />}
				</ErrorBoundary>
			</div>
			<CreateSegment isOpen={openCreateSegment} onClose={() => setOpenCreateSegment(false)} chapter={chapter} />
		</div>
	)
}
