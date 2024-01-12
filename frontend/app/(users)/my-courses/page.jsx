'use client'
import { getEnrolledCourses } from '@/api/courses'
import { Card, CardBody, CardFooter, CircularProgress, Image,Link, Progress } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import NextLink from 'next/link'

export default function Page() {
	const [courses, setCourses] = useState([])
	const [page, setPage] = useState(1)
	const [count, setCount] = useState(10)
	const { data, isLoading, isError } = useQuery({
		queryKey: ['my-courses'],
		queryFn: () => getEnrolledCourses({ page, count }),
		keepPreviousData: true,
	})
	useEffect(() => {
		if (data?.courses) {
			console.log(data?.courses)
			setCourses(data?.courses)
		}
	}, [data])

	
	

	const calculateProgress =item=>{
		console.log(item)
		const segments=item.course.chapters.map(item=>{
			return item.segments.length
		})
		console.log(segments)
		const progress=item.progress.length*100/segments.reduce((s,i)=>s+i,0)
		console.log(progress)
		return Math.ceil(progress)
	}
	return (
		<div>
			<p className="text-2xl font-bold text-default-700">My Courses</p>
			<spacer y={8} />
			<div className="flex gap-8 mt-4">
				{data && data?.courses?.map((item, index) => (
					<Card
						className="max-w-[300px]"
						shadow="sm"
						key={index}
						isPressable
						onPress={() => console.log('item pressed')}>
						<CardBody className="overflow-visible p-0">
						<Link as={NextLink} href={`courses/${item?.course?._id}`}>
							<Image 
								shadow="sm"
								radius="lg"
								width="100%"
								alt={item?.course?.title}
								className="w-64 object-cover h-32"
								src={item?.course?.thumbnail}
							/>
							</Link>
							
					
						
						</CardBody>
						<CardFooter>
							<b className="text-left text-small text-ellipsis-95">{item?.course?.title}</b>
							<CircularProgress
								label="Completed"
								size="md"
								value={calculateProgress(item)}
								color="warning"
								formatOptions={{ style: "percent" }}
								showValueLabel={true}
								/>

									

						   </CardFooter>
						   <p className="text-2xl font-bold">₹{item?.course?.price}</p>
						   <p className="text-tiny italic">
											purchased on{' '}
											{new Date(item?.purchasedAt).toLocaleDateString('en-IN', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</p>
					</Card>
				))}
			</div>
		</div>
	)
}
