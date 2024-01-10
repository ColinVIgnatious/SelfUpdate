import { NextResponse } from 'next/server'
import { logoutUser } from '@/api/users.js'

export function middleware(request) {

	const protectedUserRoutes = ['/courses', '/profile']
	const protectedTeacherRoutes = ['/teacher', '/teacher/courses', '/teacher/profile']
	const protectedAdminRoutes = ['/admin', '/admin/courses', '/admin/profile']

	const pathname = request.nextUrl.pathname

	let verify = request.cookies.get('jwt_user')
	if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
		if (verify) {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}
	if (protectedUserRoutes.includes(pathname)) {
		if (!verify) {
			return NextResponse.redirect(new URL('/login', request.url))
		}
	}

	const verifyTeacher = request.cookies.get('jwt_teacher')
	if (pathname.startsWith('/teacher/login') || pathname.startsWith('/teacher/signup')) {
		if (verifyTeacher) {
			return NextResponse.redirect(new URL('/teacher', request.url))
		}
	}
	if (protectedTeacherRoutes.includes(pathname)) {
		if (!verifyTeacher) {
			return NextResponse.redirect(new URL('/teacher/login', request.url))
		}
	}
}
