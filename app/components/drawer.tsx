"use client"

import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material"
import React, { useContext, useState } from "react"
import { DrawerContext } from "../context/drawer-provider"
import Link from "next/link"

export default function DrawerNav() {
  const { drawer, toggleDrawer } = useContext(DrawerContext)

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
      >
        <List>
          <ListItemButton>
            <Link href="/">
              <ListItemText primary="Home" />
            </Link>
          </ListItemButton>
          <ListItemButton>
            <Link href="/articles">
              <ListItemText primary="Articles" />
            </Link>
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Explore" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Publish" />
          </ListItemButton>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>
    </div>
  )
}
