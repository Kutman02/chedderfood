import { Component, type ErrorInfo } from "react"

import { ErrorFallback } from "./components/ErrorFallback"

import type {
  ErrorBoundaryProps,
  ErrorBoundaryState
} from "./types"

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {

  public state: ErrorBoundaryState = {
    hasError: false
  }

  public static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {

    return {
      hasError: true,
      error
    }

  }

  public componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ) {

    console.error(
      "Uncaught error:",
      error,
      errorInfo
    )

  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {

    if (this.state.hasError) {

      return (

        <ErrorFallback
          onReload={this.handleReload}
        />

      )

    }

    return this.props.children

  }

}