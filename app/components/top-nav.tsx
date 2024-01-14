"use client"

import React, { useEffect, useState } from "react"
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { DrawerContext } from "../context/drawer-provider"
import { useRouter } from "next/navigation"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Link from "next/link"

export default function TopNavBar() {
  const { drawer, toggleDrawer } = React.useContext(DrawerContext)
  const router = useRouter()
  const [token, setToken] = useState<null | string>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedToken = localStorage.getItem("token")
    if (storedToken) setToken(storedToken)
  }, [])

  const handleIconClick = () => {
    // localStorage.removeItem("token")
    // setToken(null)
    router.push("/auth/login")
  }

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
        {token && (
          <IconButton
            color="inherit"
            aria-label="profile"
            onClick={handleIconClick}
          >
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}
