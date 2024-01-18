'use client'
import { getPendingCoursesDetails } from '@/api/courses'
import { setProgress } from '@/api/courses'
import VideoPlayer from '@/components/VideoPlayer'
import { Accordion, AccordionItem, Button, Spacer, Tab, Tabs } from '@nextui-org/react'
import { CheckCircle, PlaySquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { changeCourseStatus,rejectCourse } from '@/api/courses'
import { useRouter } from 'next/navigation';

export default function Page({ params: { courseId } }) {
	const [course, setCourse] = useState(null)
	const [currentChapter, setCurrentChapter] = useState(null)
	const [currentSegment, setCurrentSegment] = useState(null)
	const [currentAccordian, setCurrentAccordian] = useState(null)
	const queryClient = useQueryClient()
	const router = useRouter()
	const { data, isLoading, isError } = useQuery({
		queryKey: ['pendingcoursesdetails', courseId],
		queryFn: () => getPendingCoursesDetails(courseId),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (data?.course) {
			setCourse(data?.course[0])
			console.log(data?.course)
			
		}
	}, [data])
	useEffect(() => {
		if(course?.chapters)
			{setCurrentChapter(course?.chapters[0])
			console.log('CH',course?.chapters[0])
			setCurrentSegment(course?.chapters[0].segments[0])
			setCurrentAccordian(course?.chapters[0]._id)
			}
		
	}, [course])

    const { mutate: mutatePublishCourse, isLoading: isLoadingPublish } = useMutation({
        mutationFn: changeCourseStatus,
        onSuccess: () => {
            // Assuming a successful publish operation triggers a re-fetch of the course data
            queryClient.invalidateQueries(['course', courseId]);
            toast.success('Course published successfully!');
			router.push(`/admin/courseapproval`);
        },
        onError: (error) => {
            // Handle the error, show an error message, etc.
            toast.error(error?.response?.data?.message || 'Failed to publish course!');
        },
    });

    const { mutate: mutateUnpublishCourse, isLoading: isLoadingUnpublish } = useMutation({
        mutationFn: rejectCourse,
        onSuccess: () => {
            // Assuming a successful unpublish operation triggers a re-fetch of the course data
            queryClient.invalidateQueries(['course', courseId]);
            toast.success('Course unpublished successfully!');
			router.push(`/admin/courseapproval`);
        },
        onError: (error) => {
            // Handle the error, show an error message, etc.
            toast.error(error?.response?.data?.message || 'Failed to unpublish course!');
        },
    });

    const handlePublishCourse = ({courseId}) => {
        // Trigger the publish mutation
        mutatePublishCourse({courseId});
    };

    const handleUnpublishCourse = ({courseId}) => {
        // Trigger the unpublish mutation
        mutateUnpublishCourse({courseId});
    };
	

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
if(!course) return null
	return (
		<div>
			{course && (
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
															
														</>
													) : (
														<>
															<p className="text-medium">{index + 1}.</p>
															<p className="text-medium">{seg?.title}</p>
															<PlaySquare size={14} />
															
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
							<Spacer y={4} />
							<div className="flex justify-between items-center">
								<p className="text-xl font-semibold">{currentSegment?.title}</p>
							<div>
							<Button
								size="md"
								color="success"
								onClick={()=>handlePublishCourse({courseId:course._id})}
								// disabled={isPublished}
							>
								Publish Course
							</Button>
							<Spacer x={2} />
							<Button
								size="md"
								color="danger"
								onClick={()=>handleUnpublishCourse({courseId:course._id})}
								// disabled={!isPublished}
							>
								Reject Course
							</Button>
							</div>
						</div>
							<Spacer y={4} />
							<div>
								<Tabs aria-label="Options" variant="underlined">
									<Tab key="description" title="Description">
										{currentSegment?.description}
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