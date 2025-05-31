import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoUrl = searchParams.get('url')
  const videoId = new URL(videoUrl || '').searchParams.get('v')

  if (!videoId) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

  try {
    const res = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    })
    const data = await res.json()

    return NextResponse.json({
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      link: data.link,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch video info' }, { status: 500 })
  }
}
