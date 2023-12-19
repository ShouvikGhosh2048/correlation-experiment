import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Correlation Experiment',
  description: "An experiment to check people's ability to guess the correlation of points.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="p-2 flex gap-3 bg-sky-700 text-white">
          <Link href="/">Home</Link>
          <Link href="/guess">Guess</Link>
          <Link href="/results">Results</Link>
          <Link href="/calculate">Calculate</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
