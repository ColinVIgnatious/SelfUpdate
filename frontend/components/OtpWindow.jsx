import { Input } from '@nextui-org/react'
import React from 'react'
import { useRef } from 'react'

export default function OtpWindow() {
	const otp1Ref = useRef()
	const otp2Ref = useRef()
	const otp3Ref = useRef()
	const otp4Ref = useRef()
	const otp5Ref = useRef()
	const otp6Ref = useRef()

    const handleOtpSubmit = () => {
        const otp = otp1Ref.current.value + otp2Ref.current.value + otp3Ref.current.value + otp4Ref.current.value + otp5Ref.current.value + otp6Ref.current.value
        console.log(otp)
    }

	return (
		<div className="flex justify-center items-center gap-1">
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp1Ref}
				onChange={(e) => {
					if (e.target.value.length === 1) {
						otp2Ref.current.focus()
					}
				}}
			/>
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp2Ref}
				onChange={(e) => {
					if (e.target.value.length === 1) {
						otp3Ref.current.focus()
					}
                    if (e.target.value.length === 0) {
                        otp1Ref.current.focus()
                    }
				}}
			/>
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp3Ref}
				onChange={(e) => {
					if (e.target.value.length === 1) {
						otp4Ref.current.focus()
					}
                    if (e.target.value.length === 0) {
                        otp2Ref.current.focus()
                    }
				}}
			/>
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp4Ref}
				onChange={(e) => {
					if (e.target.value.length === 1) {
						otp5Ref.current.focus()
					}
                    if (e.target.value.length === 0) {
                        otp3Ref.current.focus()
                    }
				}}
			/>
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp5Ref}
				onChange={(e) => {
					if (e.target.value.length === 1) {
						otp6Ref.current.focus()
					}
                    if (e.target.value.length === 0) {
                        otp4Ref.current.focus()
                    }
				}}
			/>
			<Input
				className="w-[30px] text-center h-[30px]"
				type="text"
				variant="bordered"
				size="sm"
				classNames={{
					inputWrapper: 'text-default-500',
				}}
				ref={otp6Ref}
				onChange={(e) => {
                    if (e.target.value.length === 1) {
                        handleOtpSubmit()
                    }
                    if (e.target.value.length === 0) {
                        otp5Ref.current.focus()
                    }
				}}
			/>
		</div>
	)
}
