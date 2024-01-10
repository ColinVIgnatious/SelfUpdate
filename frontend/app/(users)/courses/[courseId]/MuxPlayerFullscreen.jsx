import React from 'react'
import VideoPlayer from '@/components/VideoPlayer'

export default function MuxPlayerFullscreen({ playbackId }) {
	return (
		<div>
			<VideoPlayer playbackId={playbackId} />
		</div>
	)
}
