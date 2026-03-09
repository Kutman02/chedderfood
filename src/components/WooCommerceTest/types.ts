export interface TestResult {
  data?: {
    success: boolean
    count: number
  }
  error?: unknown
  message: string
}

export interface ApiTestCardProps {
  title: string
  loading: boolean
  error?: unknown
  data?: unknown
  buttonText: string
  color: "blue" | "green"
  onTest: () => void
}

export interface ResultBlockProps {
  result: TestResult | null
}

export interface ErrorBlockProps {
  title: string
  error?: unknown
}