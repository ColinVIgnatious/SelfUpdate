'use client'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect } from 'react'

export default function VideoPlayer({ segment, onEnded }) {

	return (
		<MuxPlayer
			className="w-[800px] h-[450px] rounded-md"
			streamType="on-demand"
			playbackId={segment?.video[0].playbackId}
			metadata={{
				video_id: segment?._id,
				video_title: segment?.title,
				viewer_user_id: 'user',
			}}
			onEnded={() => onEnded(segment._id)}
		/>
	)
}
