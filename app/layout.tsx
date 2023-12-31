import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { SessionProvider } from "./auth-provider"
import { SessionProviderProps } from "next-auth/react"
import { useState } from "react"
import { DrawerProvider } from "./context/drawer-provider"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "Wikiwyg",
  description:
    "Author, Edit, and Publish your informational content with ease. Wikiwyg is a WYSIWYG editor for the web.",
}

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: SessionProviderProps["session"]
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <link rel="icon" href="/icon.png" />

        <DrawerProvider>{children}</DrawerProvider>
      </body>
    </html>
  )
}
