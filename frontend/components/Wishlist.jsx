import { createFavorite, deleteFavorite } from '@/api/wishlist'
import { Spinner } from '@nextui-org/react'
import { useMutation } from 'react-query'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function FavoriteButton({ isFavorite, courseId }) {

	const [favorite, setFavorite] = useState(isFavorite)
    
	const addToFavorite = useMutation({
		mutationFn: createFavorite,
		onSuccess: () => setFavorite(true),
		onError: (error) => {
			toast.error(error?.response?.data?.message || 'Something went wrong!')
		},
	})

	const removeFromFavorite = useMutation({
		mutationFn: deleteFavorite,
		onSuccess: (data) => setFavorite(false),
		onError: (error) => {
			toast.error(error?.response?.data?.message || 'Something went wrong!')
		},
	})

	return (
		<>
			{addToFavorite?.isPending || removeFromFavorite?.isPending ? (
				<Spinner size="sm" color="danger" />
			) : favorite ? (
				<BookmarkCheck
					className="transition-colors text-red-500"
					size={20}
					strokeWidth={2}
					onClick={() => removeFromFavorite.mutate({ courseId })}
				/>
			) : (
				<Bookmark
					className="transition-colors text-gray-500"
					size={20}
					strokeWidth={2}
					onClick={() => addToFavorite.mutate({ courseId })}
				/>
			)}
		</>
	)
}