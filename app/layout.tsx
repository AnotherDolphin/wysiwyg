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
import TopNavBar from "./components/top-nav"
import DrawerNav from "./components/drawer"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "Wikiwyg",
  description:
    "Author, Edit, and Publish informational articles with ease. Wikiwyg is a WYSIWYG editor for the web.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {/* <AppRouterCacheProvider options={{ enableCssLayer: true }}> */}
        <link rel="icon" href="/icon.png" />
        <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100">
          <DrawerProvider>
            <TopNavBar />
            <div className="h-4"></div>
            <DrawerNav />
            <ToastContainer />
            {children}
          </DrawerProvider>
          {/* </AppRouterCacheProvider> */}
        </main>
      </body>
    </html>
  )
}
