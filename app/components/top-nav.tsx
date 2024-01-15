"use client"

import React, { useEffect, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popover,
  Button,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { DrawerContext } from "../context/drawer-provider"
import { useRouter } from "next/navigation"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Link from "next/link"

export default function TopNavBar() {
  const { drawer, toggleDrawer } = React.useContext(DrawerContext)
  const router = useRouter()
  const [token, setToken] = useState<null | string>(null)
  const [user, setUser] = useState<null | string>(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleAccountClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAccountClose = () => {
    setAnchorEl(null)
  }

  const handleAuthButton = () => {
    handleAccountClose()
    if (token) {
      localStorage.removeItem("token")
      setUser(null)
      setToken(null)
    }
    router.push("/auth/login")
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedToken = localStorage.getItem("token")
    if (!storedToken) return
    setToken(storedToken)

    async function fetchUserEmail(token: string) {
      const response = await fetch("http://localhost:3000/api/login", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`
        throw new Error(message)
      }

      const data = await response.json()
      return data.email
    }

    fetchUserEmail(storedToken)
      .then((email) => setUser(email))
      .catch((error) => console.error(error))
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          onKeyDown={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Link className="flex items-center flex-1" href="/">
          <img
            src={"/icon.png"}
            alt="Icon"
            style={{ margin: "10px", height: 60, borderRadius: 10 }}
          />
          <Typography
            variant="h6"
            style={{ flexGrow: 1, fontFamily: "cursive" }}
          >
            WikiWyg
          </Typography>
        </Link>
        <div className="flex-1"></div>
        {user && (
          <h6 className="text-gray-500 text-sm  hidden md:block">{user}</h6>
        )}
          <IconButton
            color="inherit"
            aria-label="profile"
            onClick={handleAccountClick}
          >
            <AccountCircleIcon />
          </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleAccountClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Button onClick={handleAuthButton}
          className="text-gray-500"
          style={{textTransform: "none"}}
          >
            {token ? "Logout" : "Login"}
          </Button>
        </Popover>
      </Toolbar>
    </AppBar>
  )
}
