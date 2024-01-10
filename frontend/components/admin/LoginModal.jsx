import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Checkbox,
	Input,
	Link,
	Image,
} from '@nextui-org/react'
import { LockIcon, MailIcon } from 'lucide-react'
import { useMutation } from 'react-query'
import { loginUser } from '@/api/admin'
import { useDispatch } from 'react-redux'
import { login } from '@/redux/slices/adminSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function LoginModal({ isOpen, onClose: onCloseModal }) {
	const [email, setEmail] = React.useState('admin@gmail.com')
	const [password, setPassword] = React.useState('1111')
	const [errors, setErrors] = React.useState({ email: '', password: '' })
	const dispatch = useDispatch()
	const router = useRouter()

	const { isLoading: isLoading, mutate: mutateLoginUser } = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			dispatch(login(data.user))
			onCloseModal()
		},
		onError: (error) => {
			const errors = error?.response?.data?.errors
			if (errors) setErrors(errors)
			else toast.error(errors?.response?.data?.message || 'Something went wrong, please try again later')
		},
	})

	const handleLogin = () => {
		let errors = {}
		if (!email || !email.trim()) errors = { ...errors, email: 'Please enter your email' }
		else if (email.indexOf('@') === -1 || email.indexOf('.') === -1)
			errors = { ...errors, email: 'Please enter a valid email' }
		if (!password || !password.trim()) errors = { ...errors, password: 'Please enter your password' }
		if (Object.keys(errors).length === 0) {
			mutateLoginUser({ email, password, role: 'admin' })
		} else setErrors(errors)
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={false}
			hideCloseButton={true}
			isOpen={isOpen}
			placement="top-center"
			backdrop="blur">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex justify-center text-default-500 pt-8 pb-4">
							<Image src="/logo.svg" width={100} height={100} radius="none"></Image>
						</ModalHeader>
						<ModalBody>
							<p className="text-default-500 font-bold text-xl">Login</p>
							<Input
								autoFocus
								endContent={
									<MailIcon
										size={18}
										className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
									/>
								}
								label="Email"
								variant="bordered"
								classNames={{
									inputWrapper: 'text-default-500',
								}}
								value={email}
								onChange={(e) => {
									setEmail(e.target.value)
									setErrors({ ...errors, email: '' })
								}}
								errorMessage={errors.email}
								isInvalid={errors.email ? true : false}
							/>
							<Input
								endContent={
									<LockIcon
										size={18}
										className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
									/>
								}
								label="Password"
								type="password"
								variant="bordered"
								classNames={{
									inputWrapper: 'text-default-500',
								}}
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
									setErrors({ ...errors, password: '' })
								}}
								errorMessage={errors.password}
								isInvalid={errors.password ? true : false}
							/>
						</ModalBody>
						<ModalFooter>
							<Button isLoading={isLoading} variant="flat" color="primary" onPress={handleLogin}>
								Sign in
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
