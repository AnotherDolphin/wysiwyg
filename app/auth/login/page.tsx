"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button, CircularProgress, TextField } from "@mui/material"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [formData, setFormData] = useState({ email: email ?? "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`)
        toast.error("Failed to login. Please check your credentials.")

        return
      }
      const { token } = await response.json()
      console.log(`User logged in successfully`, token)
      localStorage.setItem("token", token)
      // router.push(`/`)
      document.location.href = "/"
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.")

      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-center">
      <ToastContainer />

      {email && (
        <div className="flex flex-col p-2 mb-4">
          <p>
            You have been registered successfully. Please login to continue.
          </p>
        </div>
      )}
      <div className="flex flex-col p-2">
        <TextField
          className="border-2 border-gray-400 rounded-md"
          type="email"
          name="email"
          id="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex flex-col p-2">
        <TextField
          className="border-2 border-gray-400 rounded-md"
          type="password"
          name="password"
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button
        className="rounded-lg py-3 px-8 bg-[#007f80] text-white hover:bg-[#005f60] transition duration-200 ease-in-out w-32 shadow-lg m-2"
        type="submit"
        variant="contained"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} className="text-[#fff]" />
        ) : (
          "Login"
        )}
      </Button>
      <p className="text-center">
        Don't have an account?
        <Link href="/auth/register" className="text-[#007f80]">
          &nbsp;Register
        </Link>
      </p>
    </form>
  )
}
