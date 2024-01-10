'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Link, Card, CardBody, Divider, Spacer } from '@nextui-org/react'
import NextLink from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import GoogleLogin from '@/components/GoogleLogin'
import { useGoogleLogin } from '@react-oauth/google'
import { login } from '@/redux/slices/teacherSlice'
import Image from 'next/image'
import { useMutation } from 'react-query'
import { socialLoginUser, sendOtp, signupUser } from '@/api/users'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [otp, setOtp] = useState('')
	const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', otp: '' })
	const [otpSent, setOtpSent] = useState(false)
	const otpRef = useRef(null)
	const [otpTimer, setOtpTimer] = useState(60); // Set initial timer value (in seconds)


	const router = useRouter()
	const dispatch = useDispatch()

	useEffect(() => {
		if (errors?.toast) {
			toast.error(errors?.toast)
			setErrors({ ...errors, toast: '' })
		}
	}, [errors])

	const { isLoading: isLoadingSocialLogin, mutate: mutateSocialLogin } = useMutation({
		mutationFn: socialLoginUser,
		onSuccess: (data) => {
			dispatch(login(data.user))
			router.push('/teacher')
		},
		onError: (error) => {
			let errors = error?.response?.data?.errors
			if (error) setErrors(errors)
			else toast.error('Something went wrong')
		},
	})

	const { isLoading: isLoadingSendOtp, mutate: mutateSendOtp } = useMutation({
		mutationFn: sendOtp,
		onSuccess: (data) => {
			setOtpSent(true)
			toast.success('OTP sent successfully')
		},
		onError: (error) => {
			let errors = error?.response?.data?.errors
			if (error) setErrors(errors)
			else toast.error('Something went wrong')
		},
	})

	const { isLoading: isLoadingSignup, mutate: mutateSignup } = useMutation({
		mutationFn: signupUser,
		onSuccess: (data) => {
			const user = data?.user
			if (user) dispatch(login(user))
			router.push('/teacher')
		},
		onError: (error) => {
			let errors = error?.response?.data?.errors
			if (error) setErrors(errors)
			else toast.error('Something went wrong')
		},
	})

	const handleSendOtp = async (e) => {
		e.preventDefault()
		if (email === '') return setErrors({ ...errors, email: 'Please enter your email' })
		else if (email.indexOf('@') === -1 || email.indexOf('.') === -1)
			return setErrors({ ...errors, email: 'Please enter a valid email' })
		if (password === '') return setErrors({ ...errors, password: 'Please enter your password' })
		if (confirmPassword === '') return setErrors({ ...errors, confirmPassword: 'Please enter your password' })
		if (password !== confirmPassword.trim())
			return setErrors({ ...errors, confirmPassword: 'Passwords do not match' })
		// mutateSendOtp({ email, password, role: 'teacher' })
		// Start OTP timer
		setOtpTimer(60);
		const timerInterval = setInterval(() => {
			setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		// Send OTP
		mutateSendOtp({ email, password, role: 'user' })
			.then(() => {
				toast.success('OTP sent successfully');
			})
			.catch((error) => {
				let errors = error?.response?.data?.errors;
				if (error) setErrors(errors);
				else toast.error('Something went wrong');
			})
			.finally(() => {
				// Stop OTP timer when the request is completed
				clearInterval(timerInterval);
			});
   }

   const handleResendOtp = () => {
	// Reset OTP timer and resend OTP
	setOtpTimer(60);
	mutateSendOtp({ email, password, role: 'user' })
		.then(() => {
			toast.success('OTP resent successfully');
		})
		.catch((error) => {
			let errors = error?.response?.data?.errors;
			if (error) setErrors(errors);
			else toast.error('Something went wrong');
		});
};

	const handleSignupSubmit = async (e) => {
		e.preventDefault()
		if (otp === '') return setErrors({ ...errors, otp: 'Please enter the OTP' })
		mutateSignup({ email, password, otp, role: 'teacher' })
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
					<div className=" flex justify-center pb-8">
						<Image src="/logo.svg" alt="" width={100} height={100} />
					</div>
					{!otpSent ? (
						<>
							<Spacer y={4} />
							{/* <GoogleLogin isLoading={isLoadingSocialLogin} loginwithGoogle={loginwithGoogle} />
							<div className="relative mt-8 mb-4">
								<Divider className="h-[1px] bg-slate-200" />
								<span className="bg-background px-4 text-center font-bold text-sm whitespace-nowrap text-slate-500 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
									OR SIGNUP WITH EMAIL
								</span>
							</div> */}
							<div className="flex flex-col gap-4 mt-4">
								<Input
									label="Email"
									variant="bordered"
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
								<Input
									label="Confirm password"
									type="password"
									variant="bordered"
									classNames={{
										inputWrapper: 'text-default-500',
									}}
									onChange={(e) => {
										setConfirmPassword(e.target.value.trim())
										setErrors({ ...errors, confirmPassword: '' })
									}}
									errorMessage={errors?.confirmPassword}
									isInvalid={errors?.confirmPassword ? true : false}
									size="sm"
								/>
								<Spacer y={1} />
								<div className="flex justify-center">
									<Button
										isLoading={isLoadingSendOtp}
										color="primary"
										variant="flat"
										size="md"
										className="font-bold"
										onClick={handleSendOtp}>
										Continue
									</Button>
								</div>
								<Spacer y={1} />
								<div className="flex justify-center items-center gap-2">
									<span className="text-slate-500 text-sm">Already have an account?</span>
									<Link href="/teacher/login" as={NextLink} size="sm">
										<span className="text-sm underline">Login</span>
									</Link>
								</div>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-4">
							<span className="text-xs">
								Please verify your email address. We&apos;ve sent a verification code to {email}.
								Time remaining: {otpTimer}s
							</span>
							<span
								className="text-blue-500 text-xs font-bold cursor-pointer underline"
								onClick={() => {
									setErrors({ email: '', password: '', confirmPassword: '', otp: '' })
									setOtpSent(false)
								}}>
								Change email address
							</span>
							<Input
								label="OTP"
								variant="bordered"
								classNames={{
									inputWrapper: 'text-default-500',
								}}
								onChange={(e) => {
									setOtp(e.target.value.trim())
									setErrors({ ...errors, otp: '' })
								}}
								errorMessage={errors?.otp}
								isInvalid={errors?.otp ? true : false}
								size="sm"
								ref={otpRef}
							/>
							<div className="flex justify-center">
								<Button
									className="font-bold"
									isLoading={isLoadingSignup}
									color="primary"
									variant="flat"
									onClick={handleSignupSubmit}
									size="md">
									Signup
								</Button>
							</div>
							<div className="flex justify-center">
                                <Button
                                    className="font-bold"
                                    color="secondary"
                                    variant="flat"
                                    onClick={handleResendOtp}
                                    size="sm"
                                >
                                    Resend OTP
                                </Button>
                            </div>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	)
}
