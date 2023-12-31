'use client'

import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material"
import React, { useContext, useState } from "react"
import { DrawerContext } from "../context/drawer-provider"

export default function DrawerNav() {
    const { drawer, toggleDrawer } = useContext(DrawerContext)
  
  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open Drawer</Button>
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
            <ListItemText primary="Menu Item 1" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Menu Item 2" />
          </ListItemButton>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>
    </div>
  )
}
