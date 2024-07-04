import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    "Buy – Stocky",
  description:
    "Stocky is an earning app designed to provide users with the opportunity to invest in shares and earn daily profits on their deposit amount.",
};

export default async function BuyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="overflow-y-auto">
      {children}
    </section>
  )
}
