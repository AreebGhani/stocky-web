"use client"

import { useWindow } from "@/contexts/windowContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { isReactNativeWebView } = useWindow();

  return (
    <section className={`${isReactNativeWebView ? 'mt-0' : '-mt-8 md:mt-0'}`}>
      {children}
    </section>
  )
}
