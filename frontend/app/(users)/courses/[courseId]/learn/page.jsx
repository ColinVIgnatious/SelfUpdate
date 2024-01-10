'use client'
import { getCourse, getEnrollment } from '@/api/courses'
import { setProgress } from '@/api/courses'
import VideoPlayer from '@/components/VideoPlayer'
import { Accordion, AccordionItem, Button, Spacer, Tab, Tabs } from '@nextui-org/react'
import { CheckCircle, PlaySquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import Comments from './Comments'


export default function Page({ params: { courseId } }) {
	const [course, setCourse] = useState('')
	const [currentChapter, setCurrentChapter] = useState(null)
	const [currentSegment, setCurrentSegment] = useState(null)
	const [currentAccordian, setCurrentAccordian] = useState(null)
	const [enrollment, setEnrollment] = useState(null)
	const queryClient = useQueryClient()

	const { data, isLoading, isError } = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => getCourse(courseId),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (data?.course) {
			setCourse(data?.course)
			setCurrentChapter(data?.course?.chapters[0])
			setCurrentSegment(data?.course?.chapters[0].segments[0])
			setCurrentAccordian(data?.course?.chapters[0]._id)
		}
	}, [data])

	const { isLoading: isLoadingMarkProgress, mutate: mutateMarkProgress } = useMutation({
		mutationFn: setProgress,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['progress', { courseId }] })
			nextSegment()
		},
		onError: (error) => {
			const err = error?.response?.data?.message
			if (err) toast.error(error?.response?.data?.message || 'Something went wrong!')
		},
	})

	const handleMarkProgress = async (segmentId) => {
		console.log("HI")
		mutateMarkProgress({ courseId: course?._id, chapterId: currentChapter?._id, segmentId })
	}

	const {
		data: enrollmentData,
		isLoading: isLoadingEnrollment,
		isError: isErrorEnrollment,
	} = useQuery({
		queryKey: ['enrollment', courseId],
		queryFn: () => getEnrollment(courseId),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (enrollmentData?.enrollment) {
			setEnrollment(enrollmentData?.enrollment)
		}
	}, [enrollmentData])

	const checkProgressStatus = (chapterId, segmentId) => {
		const progress = enrollment?.progress?.chapters
		if (!progress) return false
		const chapter = progress.find((prog) => prog?.chapterId === chapterId)
		if (!chapter) return false
		const segment = chapter?.segments.find((seg) => seg?.segmentId === segmentId)
		if (!segment) return false
		return true
	}

	const nextSegment = () => {
		const currentSegmentIndex = currentChapter?.segments.findIndex((seg) => seg?._id === currentSegment?._id)
		if (currentSegmentIndex === currentChapter?.segments.length - 1) {
			const currentChapterIndex = course?.chapters.findIndex((chap) => chap?._id === currentChapter?._id)
			const nextChapter = course?.chapters[currentChapterIndex + 1]
			const nextSegment = nextChapter?.segments[0]
			setCurrentChapter(nextChapter)
			setCurrentAccordian(nextChapter?._id)
			setCurrentSegment(nextSegment)
			return
		}
		const nextSegment = currentChapter?.segments[currentSegmentIndex + 1]
		setCurrentSegment(nextSegment)
	}

	return (
		<div>
			{course && enrollment && (
				<>
					<h1 className="text-xl font-semibold">{course?.title}</h1>
					<Spacer y={4} />
					<div className="flex items-start gap-4">
						<div className="w-[300px] border shadow-md">
							<Accordion
								selectedKeys={[currentAccordian]}
								onSelectionChange={(key) => setCurrentAccordian(key?.currentKey)}>
								{course?.chapters?.map((chapter, index) => (
									<AccordionItem
										key={index}
										title={<p className="text-medium font-medium">{chapter?.title}</p>}>
										<div className="flex flex-col gap-2 ms-2">
											{chapter?.segments?.map((seg, index) => (
												<div
													key={index}
													className="flex items-center gap-2 cursor-pointer hover:underline"
													onClick={() => {
														setCurrentChapter(chapter)
														setCurrentSegment(seg)
													}}>
													{seg?._id === currentSegment?._id ? (
														<>
															<p className="text-medium font-medium">{index + 1}.</p>
															<p className="text-medium font-medium">{seg?.title}</p>
															<PlaySquare size={14} />
															{checkProgressStatus(chapter?._id, seg?._id) && (
																<CheckCircle size={14} color="#0f0" />
															)}
														</>
													) : (
														<>
															<p className="text-medium">{index + 1}.</p>
															<p className="text-medium">{seg?.title}</p>
															<PlaySquare size={14} />
															{checkProgressStatus(chapter?._id, seg?._id) && (
																<CheckCircle size={14} color="#0f0" />
															)}
														</>
													)}
												</div>
											))}
										</div>
									</AccordionItem>
								))}
							</Accordion>
						</div>
						<div>
							<VideoPlayer segment={currentSegment} />
							{/* onEnded={handleMarkProgress}  */}
							<Spacer y={4} />
							<div className="flex justify-between items-center">
								<p className="text-xl font-semibold">{currentSegment?.title}</p>
								<Button
									isLoading={isLoadingMarkProgress}
                                    radius='none'
									size="md"
									color="primary"
									variant="faded"
									onClick={() => handleMarkProgress(currentSegment?._id)}>
									Mark as completed
								</Button>
							</div>
							<Spacer y={4} />
							<div>
								<Tabs aria-label="Options" variant="underlined">
									<Tab key="description" title="Description">
										{currentSegment?.description}
									</Tab>
									<Tab key="comments" title="Comments">
										{/* <Comments segmentId={currentSegment?._id} /> */}
									</Tab>
									<Tab key="attachments" title="Attachments">
										No attachments
									</Tab>
								</Tabs>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}