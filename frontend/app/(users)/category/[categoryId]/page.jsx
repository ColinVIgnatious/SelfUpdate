'use client'
import {getCategorisedCourses } from '@/api/courses'
import { getFavorites } from '@/api/wishlist'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export default function Page({params:{categoryId}}) {
	const [courses, setCourses] = useState([])
	const [page, setPage] = useState(1)
	const [count, setCount] = useState(10)
	const searchParams=useSearchParams()
	const { data, isLoading, isError, } = useQuery({
		queryKey: ['categorised'],
		queryFn: () => getCategorisedCourses({ page, count, categoryId }),
		keepPreviousData: true,
	})
	
	useEffect(() => {
		console.log(data)
		if (data?.courses) {
			console.log(data?.courses)
			setCourses(data?.courses)
		}
	}, [data])
if(courses.length<1) return null
	return (
		<div>
			<div className="flex">
			<p className="text-2xl font-bold text-default-700">{courses[0].category.title} Courses..</p>
			</div>
			<spacer y={8} />
			<div className="flex gap-8 mt-4">
				{courses.map((item, index) => (
					<Card
						className="max-w-[300px]"
						shadow="sm"
						key={index}
						isPressable
						onPress={() => console.log('item pressed')}>
						<CardBody className="overflow-visible p-0">
							<Image
								shadow="sm"
								radius="lg"
								width="100%"
								alt={item?.title}
								className="w-64 object-cover h-32"
								src={item?.thumbnail}
							/>
						</CardBody>
						<CardFooter>
							<b className="text-left text-small text-ellipsis-95">{item?.title}</b>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
