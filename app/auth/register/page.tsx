import { redirect } from 'next/navigation'

const RegisterForm = () => {
  const handleSubmit = async (formData: FormData) => {
    "use server"

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (response.ok) {
        console.log(`User ${formData.get("email")} created successfully`)
        // Handle success (e.g., redirect or show success message)
      } else {
        // const data = await response.json()
        console.error(`Error: ${response}`)
        // Handle error (e.g., show error message to the user)
      }
    } catch (error) {
      console.error("Error:", error)
      // Handle other types of errors
    }
    redirect("/auth/login?email=" + formData.get("email"))
  }

  return (
    <form action={handleSubmit} className="flex flex-col w-full items-center">
      <div className="flex flex-col p-2">
        <label htmlFor="email">Email:</label>
        <input
          className="border-2 border-gray-400 rounded-md"
          type="email"
          name="email"
          id="email"
          //   value={email}
          //   onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col p-2">
        <label htmlFor="password">Password:</label>
        <input
          className="border-2 border-gray-400 rounded-md"
          type="password"
          name="password"
          id="password"
          //   value={password}
          //   onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="h-10"></div>
      <button
        type="submit"
        className="border-2 border-gray-400 rounded-lg py-3 px-8 bg-[#007f80] text-white hover:bg-[#005f60] transition duration-200 ease-in-out"
      >
        Register
      </button>
    </form>
  )
}

export default RegisterForm
