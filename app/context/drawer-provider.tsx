"use client"
import React, { createContext, useState } from "react"

type DrawerContextType = {
  drawer: boolean
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const DrawerContext = createContext<DrawerContextType>({
  drawer: false,
  toggleDrawer:
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {},
  openDrawer: () => {},
  closeDrawer: () => {},
})

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawer, setDrawer] = useState(false)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return
      }

      setDrawer(open)
    }

  const openDrawer = () => {
    setDrawer(true)
  }

  const closeDrawer = () => {
    setDrawer(false)
  }

  const drawerContextValue: DrawerContextType = {
    drawer,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  }

  return (
    <DrawerContext.Provider value={drawerContextValue}>
      {children}
    </DrawerContext.Provider>
  )
}
