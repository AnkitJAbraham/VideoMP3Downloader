import './globals.css'
import { Adamina, Montserrat } from 'next/font/google'

const adamina = Adamina({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-adamina',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'Video to MP3',
  description: 'Download YouTube videos as MP3s',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${adamina.variable} ${montserrat.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

