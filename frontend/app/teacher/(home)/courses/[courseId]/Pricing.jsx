import { Input } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '@/redux/slices/courseSlice'

export default function Pricing({ errors, setErrors }) {
	const { course } = useSelector((state) => state.course)
	const dispatch = useDispatch()

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 m-2">
			<Input
				isClearable
				type="number"
				label="Selling price"
				placeholder="0.00"
				labelPlacement="outside"
				startContent={
					<div className="pointer-events-none flex items-center">
						<span className="text-default-400 text-small">₹</span>
					</div>
				}
				value={course?.price || 0}
				classNames={{
					inputWrapper: 'text-default-500',
					label: 'text-[14px] font-medium text-slate-700',
				}}
				onChange={(e) => {
					dispatch(add({ ...course, price: e.target.value }))
					setErrors({ ...errors, price: '' })
				}}
				errorMessage={errors?.price}
			/>
			<Input
				isClearable
				type="number"
				label="MRP"
				placeholder="0.00"
				labelPlacement="outside"
				startContent={
					<div className="pointer-events-none flex items-center">
						<span className="text-default-400 text-small">₹</span>
					</div>
				}
				value={course?.mrp || 0}
				classNames={{
					inputWrapper: 'text-default-500',
					label: 'text-[14px] font-medium text-slate-700',
				}}
				onChange={(e) => {
					dispatch(add({ ...course, mrp: e.target.value }))
					setErrors({ ...errors, mrp: '' })
				}}
				errorMessage={errors?.mrp}
			/>
		</div>
	)
}
