"use client"

import React from "react"
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { DrawerContext } from "../context/drawer-provider"
import { useRouter } from 'next/navigation'

export default function TopNavBar() {
  const { drawer, toggleDrawer } = React.useContext(DrawerContext)
  const router = useRouter()
  
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
        <img src={"/icon.png"} alt="Icon" style={{ margin: "10px", height: 60, borderRadius: 10 }} onClick={
            () => router.push("/")
        }/>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          WikiWyg
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
