'use client'
import React, { useEffect } from 'react'
import CourseListingItem from '@/components/CourseListingItem'
import { Spacer } from '@nextui-org/react'
import { useQuery } from 'react-query'
import { getCourses } from '@/api/courses'
import { useState } from 'react'

export default function Page() {
	const [courses, setCourses] = useState([])
	const { data, isLoading, isError } = useQuery({
		queryKey: ['courses', 'latest'],
		queryFn: () => getCourses(5, 'latest'),
		keepPreviousData: true,
	})
	useEffect(() => {
		if (data?.courses) setCourses(data?.courses)
	}, [data])
	return (
		<>
			<p className="text-[1.3rem] font-semibold text-gray-800">Latest courses</p>
			<Spacer y={2} />
			<div className="flex gap-2">
				{courses && courses.map((course) => <CourseListingItem key={course._id} course={course} />)}
			</div>
		</>
	)
}
