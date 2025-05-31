import { NextRequest } from 'next/server'

function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input)
    if (url.hostname === 'youtu.be') return url.pathname.slice(1)
    if (url.hostname.includes('youtube.com')) return url.searchParams.get('v')
    return null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get('url')
  if (!videoUrl) return new Response('Missing url', { status: 400 })

  const videoId = extractVideoId(videoUrl)
  if (!videoId) return new Response('Invalid YouTube URL', { status: 400 })

  try {
    const res = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    })

    const data = await res.json()

    if (!res.ok || !data.link) {
      console.error('Error from RapidAPI:', data)
      return new Response(JSON.stringify({ error: 'Failed to get MP3 link', details: data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return Response.redirect(data.link)
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
