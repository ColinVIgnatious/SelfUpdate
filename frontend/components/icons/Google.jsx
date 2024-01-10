import Image from 'next/image'
import React from 'react'
export const Google = ({ fill = 'currentColor', filled, size, height, width, label, ...props }) => {
	return (
        <Image src="/google_icon.svg" alt="" width={20} height={20} />
	)
}
