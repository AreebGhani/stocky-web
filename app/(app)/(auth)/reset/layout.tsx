import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    "Reset – Stocky",
  description:
    "Stocky is an earning app designed to provide users with the opportunity to invest in shares and earn daily profits on their deposit amount.",
  keywords: ['stocky', 'stocky.uk', 'stocky.uk.com', 'stocky uk', 'stocky uk com', 'stocky pakistan', 'www.stocky.uk.com', 'www.stocky.uk', 'www stocky uk', 'www stocky uk com', 'stocky login', 'stocky register', 'stocky signup', 'stocky create acount', 'stocky market', 'stocky dashboard', 'stocky account', 'stocky account recovery', 'stocky forgot password', 'stocky forget'],
  creator: "Stocky.uk.com",
  publisher: "Stocky.uk.com",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://stocky.uk.com",
  },
};

export default async function ResetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {children}
    </section>
  )
}
