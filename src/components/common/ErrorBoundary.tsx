import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('StuAr AI error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-[60vh] place-items-center p-6">
          <div className="glass max-w-md rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-red-500/15 text-red-400">
              <TriangleAlert className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              className="btn-primary mt-5"
              onClick={() => {
                this.setState({ error: null })
                window.location.assign('/')
              }}
            >
              Back to safety
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
