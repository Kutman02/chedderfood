import { LoginTestForm } from "./components/LoginTestForm"
import { AuthButtons } from "./components/AuthButtons"
import { ResultViewer } from "./components/ResultViewer"

import { useAuthTest } from "./hooks/useAuthTest"

const AuthTest = () => {

  const auth = useAuthTest()

  return (

    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Тест авторизации
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <LoginTestForm
            username={auth.username}
            password={auth.password}
            setUsername={auth.setUsername}
            setPassword={auth.setPassword}
            testLogin={auth.testLogin}
            loading={auth.loading}
          />

          <AuthButtons
            testGetCurrentUser={auth.testGetCurrentUser}
            testAppPassword={auth.testAppPassword}
            testWooCommerceAPI={auth.testWooCommerceAPI}
            testDebugAuth={auth.testDebugAuth}
          />

        </div>

        <ResultViewer result={auth.result} />

      </div>

    </div>

  )

}

export default AuthTest