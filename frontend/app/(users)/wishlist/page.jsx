'use client'
import {getWishlistedCourses } from '@/api/courses'
import { getFavorites } from '@/api/wishlist'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export default function Page() {
	const [courses, setCourses] = useState([])
	const [page, setPage] = useState(1)
	const [count, setCount] = useState(10)
	const { data, isLoading, isError } = useQuery({
		queryKey: ['wishlist'],
		queryFn: () => getWishlistedCourses({ page, count }),
		keepPreviousData: true,
	})
	useEffect(() => {
		if (data?.courses) {
			console.log(data?.courses)
			setCourses(data?.courses)
		}
	}, [data])

	
	
	return (
		<div>
			<div className="flex">
			<p className="text-2xl font-bold text-default-700">Wishlist</p>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-check"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
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
								alt={item?.course[0].title}
								className="w-full object-cover h-[140px]"
								src={item?.course[0].thumbnail}
							/>
						</CardBody>
						<CardFooter>
							<b className="text-left text-small text-ellipsis-95">{item?.course[0].title}</b>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
