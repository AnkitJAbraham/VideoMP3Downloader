/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import Image from "next/image";

type VideoInfo = {
  title?: string;
  thumbnail?: string;
  duration?: number;
  [key: string]: any;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [valid, setValid] = useState(false);
  const [info, setInfo] = useState<VideoInfo>([]);
  const [loading, setLoading] = useState(false);

  const isValidYouTubeUrl = (link: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(link);

  const handleSubmit = async () => {
    if (!isValidYouTubeUrl(url)) return;
    setLoading(true);
    const res = await fetch(`/api/fetch-info?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setInfo(data);
    setValid(true);
    setLoading(false);
  };

  return (
    <main className="relative lg:flex lg:h-screen w-full font-sans overflow-hidden">
      {/* Left Panel */}
      <div
        className={`
          fixed top-0 left-0 w-full h-full bg-gray-100 z-30 transition-transform duration-700
          flex flex-col justify-center items-center gap-10 p-8
          ${valid ? "-translate-x-full" : "translate-x-0"}
          lg:static lg:translate-x-0 lg:w-1/2 lg:h-full lg:z-auto
        `}
      >
        <div className="text-center text-4xl font-heading font-Adamina mb-6">
          Download YouTube Videos, Amma         <span className="text-xs">by Unni</span>
        </div>

        <p className="text-center text-xl">
          Copy YouTube video link (long press or right click on video, then
          &ldquo;Copy Link&rdquo;) and paste below
        </p>
        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full max-w-md p-3 border rounded mb-4"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!url || loading}
          className="font-bold cursor-pointer bg-gradient-to-r from-teal-300 to-sky-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Download Link ->"}
        </button>
      </div>

      {/* Right Panel */}
      <div
        className={`
          fixed top-0 left-0 w-full h-full bg-white z-20 transition-transform duration-700
          flex flex-col justify-center items-center gap-8 p-8 text-center
          ${valid ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0 lg:w-2/3 lg:h-full lg:z-auto
        `}
      >
        {info && (
          <>
            <h2
              className="text-2xl font-heading mb-4"
              style={{ fontFamily: "Adamina, serif" }}
            >
              Title -{" "}
              <span className="font-sans font-semibold">{info.title}</span>
            </h2>

            {info.duration && (
              <p className="text-gray-600 mb-2 font-medium">
                Duration: {Math.floor(info.duration / 60)}:
                {Math.floor(info.duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            )}

            <div className="relative w-64 lg:w-84 h-36 lg:h-48 mb-6">
              <Image
                src={info.thumbnail || "/placeholder.png"}
                alt="thumbnail"
                fill
                className="rounded shadow object-cover"
                priority
                sizes="256px"
              />
            </div>

            <form method="GET" action="/api/download">
              <input type="hidden" name="url" value={url} />
              <button
                type="submit"
                className="block font-bold bg-gradient-to-r from-teal-300 to-sky-800 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                Download Now
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
