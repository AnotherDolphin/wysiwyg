"use client"

import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import { DrawerContext } from "../context/drawer-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DrawerNav() {
  const { drawer, toggleDrawer, closeDrawer } = useContext(DrawerContext)
  const pathname = usePathname()

  useEffect(() => {
    console.log("pathname", pathname)
    closeDrawer()
  }, [pathname])

  return (
    <div>
      {/* <Button onClick={toggleDrawer(true)}>Open Drawer</Button> */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawer}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: "200px" },
        }}
      >
        <img
          src={"/icon.png"}
          alt="Icon"
          className="m-auto rounded-lg my-8"
          width={60}
          height={60}
          //   onClick={() => router.push("/")}
        />
        <List>
          <Link href="/">
            <ListItemButton>
              <ListItemText primary="Home" />
            </ListItemButton>
          </Link>
          <Link href="/articles">
            <ListItemButton>
              <ListItemText primary="Articles" />
            </ListItemButton>
          </Link>
          <ListItemButton>
            <ListItemText primary="Explore" />
          </ListItemButton>
          <Link href="/articles/author">
            <ListItemButton>
              <ListItemText primary="Author" />
            </ListItemButton>
          </Link>
          <div className="h-[50vh]"></div>
          <ListItemButton>
            <ListItemText primary="Login" />
          </ListItemButton>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>
    </div>
  )
}
