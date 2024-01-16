"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, CircularProgress, TextField } from "@mui/material"
import Link from "next/link"

const RegisterForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // console.log(`User ${formData.email} created successfully`)
        router.push(`/auth/login?email=${formData.email}`)
        // Handle success (e.g., redirect or show success message)
      } else {
        console.error(
          `Error: ${response.status} ${
            response.statusText
          } - ${await response.text()}`
        )
        // Handle error (e.g., show error message to the user)
      }
    } catch (error) {
      console.error("Error:", error)
      // Handle other types of errors
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
        type="submit"
        disabled={loading} // Disable button when loading
        className="rounded-lg py-3 px-8 bg-[#007f80] text-white hover:bg-[#005f60] transition duration-200 ease-in-out w-32 shadow-lg m-2"
        variant="contained"
      >
        {loading ? (
          <CircularProgress size={24} className="text-[#007f80]" />
          ) : (
          "Register"
        )}
      </Button>
      <p>
        Already registered?&nbsp;
        <Link href="/auth/login" className="text-[#007f80]">
          Login
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
