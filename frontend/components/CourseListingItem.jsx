import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Image, Link, Button } from '@nextui-org/react'
import NextLink from 'next/link'
import Wishlist from "./Wishlist"
import { QueryClient, useMutation } from 'react-query';
import { createChat } from '@/api/chat';
import toast from 'react-hot-toast';

export default function CourseListingItem({course}) {
	console.log(course)
	const queryClient=new QueryClient()
	const { isPending: isLoadingCreateChat, mutate: mutateCreateChat } = useMutation({
		mutationFn: createChat,
		onSuccess: (data) => {
			// setChat(data?.chat)
			// expandChat()
			queryClient.invalidateQueries({ queryKey: ['chats'] })
		},
		onError: (error) => {
			const err = error?.response?.data?.message
			if (err) toast.error(error?.response?.data?.message || 'Something went wrong!')
		},
	})
	return (
		<Card className="max-w-[350px]">
				<CardHeader className="justify-between">
				<Link as={NextLink} href={`courses/${course?._id}`}>
					<Image className='w-64 h-32'
						isBlurred
						src={course.thumbnail}
						width={350}
						height={200}
						style={{ objectFit: 'cover' }}
						/>
						</Link>
				</CardHeader>
				<CardBody className="px-3 py-0">
				<div className="flex justify-between items-end gap-2">
					<p className="text-medium font-bold text-gray-700">{course.title}</p>
					<Wishlist isFavorite={course?.isFavorite} courseId={course?._id}/>
				</div>	
					<span className="pt-1">{course?.teacher?.name}</span>
				</CardBody>
				<CardFooter className="gap-3">
					<div className="flex items-end gap-2">
						<p className="font-semibold text-default-700 text-medium">₹{course.price}</p>
						
							<p className="text-default-400 text-small line-through font-medium">₹{course.mrp}</p>
							<button onClick={() => {
											mutateCreateChat({ receiver: course?.teacher?._id })
										}}>Start Chat</button>
									
					</div>
					
				</CardFooter>
			</Card>
	)
}
