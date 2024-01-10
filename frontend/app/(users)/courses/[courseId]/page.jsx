'use client'
import { useEffect, useState } from 'react'
import {
	Breadcrumbs,
	BreadcrumbItem,
	Spacer,
	Accordion,
	AccordionItem,
	Button,
	Image,
	Card,
	CardBody,
	CardFooter,
	Tab,
	Tabs,
} from '@nextui-org/react'
import { useQuery, useMutation, QueryClient } from 'react-query'
import { getCourse, createStripeSession, getEnrollment } from '@/api/courses'
import toast from 'react-hot-toast'

import { Home, PlayCircle, PlaySquare } from 'lucide-react'
// import Reviews from './Reviews'
import { useRouter } from 'next/navigation'
// import { createChat } from '@/api/chats'


export default function App({ params: { slug, courseId } }) {
	const [course, setCourse] = useState('')
	const [enrollment, setEnrollment] = useState('')
	const router = useRouter()
    const queryClient = new QueryClient()

	const { data, isLoading, isError } = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => getCourse(courseId),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (data?.course) {
			setCourse(data?.course)
		}
	}, [data])

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

	const { isLoading: isLoadingStripeSession, mutate: mutateStripeSession } = useMutation({
		mutationFn: createStripeSession,
		onSuccess: (data) => {
			toast.loading('Redirecting to payment gateway...')
			window.location.href = data.sessionUrl
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || error?.response?.data?.errors?.toast || 'Something went wrong'
			)
		},
	})

	const handleEnroll = () => {
		if (!enrollment) mutateStripeSession({ courseId })
		else router.push(`/courses/${courseId}/learn`)
	}

    // const { isLoading: isLoadingCreateChat, mutate: mutateCreateChat } = useMutation({
	// 	mutationFn: createChat,
	// 	onSuccess: (data) => {
	// 		toast('Chat created successfully!')
    //         queryClient.invalidateQueries('chats')
    //         toggleExpand()
	// 	},
	// 	onError: (error) => {
	// 		const err = error?.response?.data?.message
	// 		if (err) toast.error(error?.response?.data?.message || 'Something went wrong!')
	// 	},
	// })

	return (
		<>
			{course && (
				<>
					<Breadcrumbs>
						<BreadcrumbItem>
							<Home size={14} />
						</BreadcrumbItem>
						<BreadcrumbItem className="font-medium">{course?.category?.title}</BreadcrumbItem>
						<BreadcrumbItem className="font-medium">{course?.title}</BreadcrumbItem>
					</Breadcrumbs>
					<Spacer y={6} />
					<div className="flex justify-center items-start gap-8">
						<Card shadow="sm" className="min-w-[350px]" radius="none">
							<CardBody className="overflow-visible p-0 opacity-90 hover:opacity-100">
								<div className="relative">
									<Image
										width={350}
										height={200}
										alt={course?.title}
										className="w-full h-[200px] object-cover rounded-none"
										src={course?.thumbnail}
									/>
									<div className="absolute inset-0 flex justify-center items-center z-10">
										<PlayCircle
											size={46}
											color="#fff"
											className="shadow cursor-pointer"
											onClick={() => toast('play intro video')}
										/>
									</div>
								</div>
							</CardBody>
							<CardFooter className="justify-start">
								<div className="w-full">
									{enrollment ? (
										<p className="text-tiny italic">
											purchased on{' '}
											{new Date(enrollment.purchasedAt).toLocaleDateString('en-IN', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</p>
									) : (
										<div className="flex justify-start items-baseline gap-2">
											<p className="text-2xl font-bold">₹{course?.price}</p>
											<p className="text-default-500 line-through">₹{course?.mrp}</p>
											<p className="text-default-500 text-sm">
												{Math.ceil((course.price * 100) / course.mrp)}% off
											</p>
										</div>
									)}
									<Spacer y={3} />
									<Button
										isLoading={isLoadingStripeSession}
										fullWidth={true}
										color="primary"
										variant="flat"
										size="lg"
										radius="none"
										onClick={handleEnroll}
										className="font-bold">
										{enrollment
											? enrollment?.progress > 0
												? 'Continue Learning'
												: 'Start Learning'
											: 'Enroll Now'}
									</Button>
									<Spacer y={4} />
									<p className="text-tiny text-default-500 text-center">
										30-Day Money-Back Guarantee
									</p>
									<Spacer y={2} />
									<p className="text-tiny text-default-500 text-center">Full Lifetime Access</p>
									<Spacer y={2} />
								</div>
							</CardFooter>
						</Card>
						<div className="flex-grow max-w-[800px]">
							<p className="text-3xl font-bold -mt-2">{course?.title}</p>
							<Spacer y={2} />
							<p className="text-base">{course?.description}</p>
							<Spacer y={2} />
							<div className="flex gap-2">
								<p className="text-sm">Created by {course?.teacher?.name}</p>
								{/* <p className="text-sm text-primary underline cursor-pointer" onClick={() => {
                                    mutateCreateChat({ receiver: course?.teacher?._id })
                                }}>
									Start Chat
								</p> */}
							</div>
							<Spacer y={2} />
							<div className="flex gap-3">
								<p className="text-sm">Last updated 11/2023</p>
								<p className="text-sm">English</p>
							</div>
							{/* <Spacer y={3} />
							<Card shadow="sm" className="mx-3" radius='none'>
								<CardBody>
									<div className="flex gap-2">
										<Image
											src={course?.teacher?.avatar}
											alt={course?.teacher?.name}
											width={50}
											height={50}
											className="rounded-full"
										/>
										<div>
											<p className="text-sm font-bold">{course?.teacher?.name}</p>
											<p className="text-sm">{course?.teacher?.bio}</p>
										</div>
									</div>
								</CardBody>
							</Card> */}
							<Spacer y={3} />
							<Tabs aria-label="Options" variant="underlined">
								<Tab key="content" title="Content">
									<Accordion variant="light" className="border shadow-md">
										{course?.chapters?.map((chapter, index) => (
											<AccordionItem
												key={index}
												title={<p className="text-sm font-medium">{chapter.title}</p>}>
												<div className="flex flex-col gap-2 ms-2">
													{chapter?.segments?.map((seg, index) => (
														<div
															key={index}
															className="flex items-center gap-2 cursor-pointer hover:underline">
															<p className="text-sm">{index + 1}.</p>
															<p className="text-sm">{seg.title}</p>
															<PlaySquare size={14} />
														</div>
													))}
												</div>
											</AccordionItem>
										))}
									</Accordion>
								</Tab>
								<Tab key="reviews" title="Reviews">
									{/* <Reviews courseId={course._id} /> */}
								</Tab>
							</Tabs>
						</div>
					</div>
				</>
			)}
		</>
	)
}