'use client'

import { Card, CardBody, Input } from '@nextui-org/react'
import { GripVertical, LayoutDashboard, Package, PackagePlus, Pencil } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

export default function Page() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [level, setLevel] = useState('')
	const [image, setImage] = useState('')
	const [price, setPrice] = useState('')
	const [mrp, setMrp] = useState('')
	const [errors, setErrors] = useState({})

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
			<div className="">
				<p className="text-lg font-bold">Chapter setup</p>
				<div className="flex items-center gap-1 mt-6">
					<LayoutDashboard size={16} />
					<span className="font-medium">Basic Details</span>
				</div>
				<Input
					className="mt-6"
					key="title"
					variant="bordered"
					type="text"
					label="Chapter Title"
					classNames={{ label: 'text-sm text-slate-700' }}
					labelPlacement="outside"
					placeholder=" "
					value={title}
					onChange={(e) => {
						setTitle(e.target.value)
						setErrors({ ...errors, title: '' })
					}}
					errorMessage={errors?.title}
				/>

				<Input
					className="mt-6"
					key="description"
					variant="bordered"
					type="text"
					label="Chapter Description"
					classNames={{ label: 'text-sm text-slate-700' }}
					labelPlacement="outside"
					placeholder=" "
					value={description}
					onChange={(e) => {
						setDescription(e.target.value)
						setErrors({ ...errors, description: '' })
					}}
					errorMessage={errors?.description}
				/>
				<div className="flex items-center gap-1 mt-6">
					<Package size={16} />
					<span className="font-medium">Lessons</span>
				</div>
				<div className="flex flex-col gap-4 p-4 border rounded-md mt-4">
					<div className="flex justify-between items-center">
						<div className="flex justify-left items-center gap-1">
							<GripVertical size={16} />
							<span className="font-medium">Lesson 1</span>
						</div>
						<Pencil size={16} />
					</div>
					<div className="flex justify-between items-center">
						<div className="flex justify-left items-center">
							<GripVertical size={16} />
							<span className="font-medium">Lesson 2</span>
						</div>
						<Pencil size={16} />
					</div>
				</div>
				<div className="flex justify-center items-center gap-1">
					<PackagePlus size={16} />
					<p>Add a new lesson</p>
				</div>
				<p className="italic">Drag and drop to rearrange lessons</p>
			</div>
			<div>
				<div className="">
					<p className="text-lg font-bold">Lessons</p>
					<Input
						className="mt-6"
						key="title"
						variant="bordered"
						type="text"
						label="Lesson Title"
						classNames={{ label: 'text-sm text-slate-700' }}
						labelPlacement="outside"
						placeholder=" "
						value={title}
						onChange={(e) => {
							setTitle(e.target.value)
							setErrors({ ...errors, title: '' })
						}}
						errorMessage={errors?.title}
					/>

					<Input
						className="mt-6"
						key="description"
						variant="bordered"
						type="text"
						label="Lesson Description"
						classNames={{ label: 'text-sm text-slate-700' }}
						labelPlacement="outside"
						placeholder=" "
						value={description}
						onChange={(e) => {
							setDescription(e.target.value)
							setErrors({ ...errors, description: '' })
						}}
						errorMessage={errors?.description}
					/>
					<div className='border h-[100px] mt-6'>
                        <p>Video</p>
                    </div>
                    <div className='border h-[50px] mt-6'>
                        <p>Attachments</p>
                    </div>
				</div>
			</div>
		</div>
	)
}
