import React, { Component } from 'react'

class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null, errorInfo: null }
	}

	// This lifecycle method is called when an error occurs
	componentDidCatch(error, errorInfo) {
		this.setState({ hasError: true, error, errorInfo })
		// You can log the error to a service like Sentry or your server
		console.log(error)
	}

	render() {
		// If an error occurred, render the fallback UI
		if (this.state.hasError) {
			return <div className="border rounded-md p-2 text-danger-500">{this.state.error.toString()}</div>
		}

		// Otherwise, render the children
		return this.props.children
	}
}

export default ErrorBoundary
