"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplateContent = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} redirectUrl={redirectUrl} />
      ) : (
        <Register setCurrentView={setCurrentView} redirectUrl={redirectUrl} />
      )}
    </div>
  )
}

const LoginTemplate = () => {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
      <LoginTemplateContent />
    </Suspense>
  )
}

export default LoginTemplate
