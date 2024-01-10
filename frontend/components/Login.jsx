import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Checkbox,
	Input,
	Link,
	Card,
	CardBody,
	Divider,
} from '@nextui-org/react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import Image from 'next/image'

export default function Login({ show, onHide }) {
	return (
		<>
			<GoogleOAuthProvider clientId="<your_client_id>">
				<Modal size="" isOpen={show} onOpenChange={onHide} isDismissable={false} placement="center">
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
								<div className=" flex justify-center pb-8">
									<Image src="/logo.svg" alt="" width={100} height={100} />
								</div>
								<div>
									<Card className="mx-6 my-4 cursor-pointer hover:bg-slate-100">
										<CardBody>
											<div className="flex justify-start items-center gap-4">
												<GoogleLogin
													onSuccess={(credentialResponse) => {
														console.log(credentialResponse)
													}}
													onError={() => {
														console.log('Login Failed')
													}}
												/>
												;
											</div>
										</CardBody>
									</Card>
									<Card className="mx-6 my-4 cursor-pointer hover:bg-slate-100">
										<CardBody>
											<div className="flex justify-start items-center gap-4">
                                                <Image src="/fb_icon.svg" alt="" width={20} height={20} />
												<span className="font-bold">Continue with Facebook22</span>`
											</div>
										</CardBody>
									</Card>
								</div>
								<div className="relative my-4">
									<hr className="mx-6"></hr>
									<span className="bg-background px-4 text-center text-slate-500 text-sm absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
										OR
									</span>
								</div>
								<ModalBody>
									<Input autoFocus label="Email" variant="bordered" />
									<Input label="Password" type="password" variant="bordered" />
									<div className="flex py-2 px-1 justify-between">
										<Checkbox
											classNames={{
												label: 'text-small',
											}}>
											Remember me
										</Checkbox>
										<Link color="primary" href="#" size="sm">
											Forgot password?
										</Link>
									</div>
								</ModalBody>
								<ModalFooter>
									{/* <Button color="danger" variant="flat" onPress={onClose}>
									Close
								</Button> */}
									<Button color="primary" onPress={onClose}>
										Sign in
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</GoogleOAuthProvider>
		</>
	)
}
