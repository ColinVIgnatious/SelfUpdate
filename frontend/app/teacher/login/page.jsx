'use client'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Link, Card, CardBody, Divider, Spacer } from '@nextui-org/react'
import NextLink from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { QueryClient, useMutation } from 'react-query'
import { loginUser, socialLoginUser } from '@/api/users'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google'
import { login } from '@/redux/slices/teacherSlice'
import GoogleLogin from '@/components/GoogleLogin'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({ email: '', password: '' })
	const queryClient = new QueryClient()
	const { isLoading: isLoadingLogin, mutate: mutateLoginUser } = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			dispatch(login(data.user))
			queryClient.setQueryData(['teacher', { email, password }], data)
			router.push('/teacher/courses')
		},
		onError: (error) => {
			const errors = error?.response?.data?.errors
			if (errors) setErrors(errors)
			else toast.error('Something went wrong, Please try again later')
		},
	})
	const { isLoading: isLoadingSocialLogin, mutate: mutateSocialLogin } = useMutation({
		mutationFn: socialLoginUser,
		onSuccess: (data) => {
			dispatch(login(data.user))
			router.push('/teacher/courses')
		},
		onError: (error) => {
			const errorMessage = error?.response?.data?.errors
			setErrors(errorMessage)
		},
	})

	const router = useRouter()
	const dispatch = useDispatch()

	useEffect(() => {
		console.log(errors)
		if (errors?.toast) {
			toast.error(errors?.toast)
			setErrors({ ...errors, toast: '' })
		}
	}, [errors])

	const handleSubmit = async (e) => {
		e.preventDefault()
		let newErrors = {}
		if (email === '') newErrors.email = 'Please enter your email'
		else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) newErrors.email = 'Please enter a valid email'
		if (password === '') newErrors.password = 'Please enter your password'

		if (Object.keys(newErrors).length === 0) {
			try {
				mutateLoginUser({ email, password, role: 'teacher' })
			} catch (error) {
				console.log('error')
			}
		} else {
			setErrors(newErrors)
		}
	}

	const loginwithGoogle = useGoogleLogin({
		onSuccess: (codeResponse) => {
			handleSocialLogin('google', codeResponse.code)
		},
		flow: 'auth-code',
	})

	const handleSocialLogin = async (type, code) => {
		mutateSocialLogin({ type, code, role: 'teacher' })
	}

	return (
		<div className="flex h-full justify-center items-center">
			<Card className="w-[400px] p-6">
				<CardBody>
					<div className="flex justify-center pb-8">
						<Image src="/logo.svg" alt="" width={100} height={100} />
					</div>
					{/* <GoogleLogin isLoading={isLoadingSocialLogin} loginwithGoogle={loginwithGoogle} />
					<Spacer y={6} />
					<div className="relative">
						<Divider className="h-[1px] bg-slate-200" />
						<span className="bg-background px-4 text-center font-bold text-sm whitespace-nowrap text-slate-500 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
							OR LOGIN WITH EMAIL
						</span>
					</div> */}
					<Spacer y={6} />
					<div className="flex flex-col gap-4">
						<Input
							label="Email"
							type="email"
							variant="bordered"
							radius="lg"
							classNames={{
								inputWrapper: 'text-default-500',
							}}
							onChange={(e) => {
								setEmail(e.target.value.trim())
								setErrors({ ...errors, email: '' })
							}}
							errorMessage={errors?.email}
							isInvalid={errors?.email ? true : false}
							size="sm"
						/>
						<Input
							label="Password"
							type="password"
							variant="bordered"
							radius="lg"
							classNames={{
								inputWrapper: 'text-default-500',
							}}
							onChange={(e) => {
								setPassword(e.target.value.trim())
								setErrors({ ...errors, password: '' })
							}}
							errorMessage={errors?.password}
							isInvalid={errors?.password ? true : false}
							size="sm"
						/>
						<div className="flex py-2 px-1 justify-between">
							{/* <Checkbox
								size="sm"
								classNames={{
									label: 'text-small',
								}}>
								Remember me
							</Checkbox>
							<Link color="primary" href="#" size="sm">
								Forgot password?
							</Link> */}
						</div>

						<div className="flex justify-center">
							<Button
								className="px-4 font-bold"
								isLoading={isLoadingLogin}
								color="primary"
								variant="flat"
								size="md"
								onClick={handleSubmit}>
								Sign in
							</Button>
						</div>
						<Spacer y={2} />
						<div className="flex justify-center items-center gap-2">
							<span className="text-slate-500 text-sm">Don&apos;t have an account?</span>
							<Link href="/teacher/signup" as={NextLink} size="sm">
								Signup
							</Link>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	)
}
