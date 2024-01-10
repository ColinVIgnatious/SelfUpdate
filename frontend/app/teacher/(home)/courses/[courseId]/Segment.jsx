import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Input, Progress, Spacer, Textarea } from '@nextui-org/react'
import React from 'react'
import MuxUpload from './MuxUpload'
import { FolderIcon, HomeIcon } from 'lucide-react'

export default function Segment({ content, setContent, errors, setErrors }) {
	return (
		<div>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<FolderIcon size={12}/>}>Song</BreadcrumbItem>
                <BreadcrumbItem>Segment</BreadcrumbItem>
			</Breadcrumbs>
            <Spacer y={4} />
			<Input
				isClearable
				label="Segemnt Title"
				labelPlacement="outside"
				placeholder=" "
				className="w-full"
				onClear={() => onClear()}
				classNames={{
					inputWrapper: 'text-default-500',
					label: 'text-[14px] font-medium text-slate-700',
				}}
				value={content?.title}
				onChange={(e) => {
					setContent({ ...content, title: e.target.value })
					setErrors({ ...errors, content: { ...errors.content, title: '' } })
				}}
				errorMessage={errors?.content?.title}
			/>
			<Spacer y={4} />
			<Textarea
				label="Description"
				labelPlacement="outside"
				placeholder=" "
				value={content?.description}
				classNames={{
					label: 'text-[14px] font-medium text-slate-700',
					description: 'text-tiny text-slate-500 text-end',
				}}
				minRows={3}
				maxRows={3}
				onChange={(e) => {
					setContent({ ...content, description: e.target.value })
					setErrors({ ...errors, content: { ...errors.content, description: '' } })
				}}
				errorMessage={errors?.content?.description}
				description=""
			/>
			<Spacer y={4} />
			<div className="w-[400px]">
				<h2 className="text-[14px] font-medium text-slate-700">Segment video</h2>
				<Card className="mt-2">
					<CardBody>
						<MuxUpload errors={errors} setErrors={setErrors} />
					</CardBody>
				</Card>
				<p className="text-tiny text-danger">{errors?.content?.video}</p>
			</div>
			<Spacer y={4} />
			<p className="text-[14px] font-medium text-slate-700">Attachments</p>
			<label className="block mt-2">
				<input
					type="file"
					className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-slate-700
                                hover:file:bg-violet-100"
				/>
			</label>
		</div>
	)
}
