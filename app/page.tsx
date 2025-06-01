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
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const isValidYouTubeUrl = (link: string) =>
    /^(https?:\/\/)?((www|m)\.)?(youtube\.com|youtu\.be)\/.+$/.test(link);

  const handleSubmit = async () => {
    if (!isValidYouTubeUrl(url)) {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setDownloaded(false); // Reset download status
    const res = await fetch(`/api/fetch-info?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setInfo(data);
    setValid(true);
    setLoading(false);
  };

  const handleDownload = () => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}`;
    window.location.href = downloadUrl;
    setDownloaded(true);
  };

  return (
<main className="relative lg:flex lg:h-screen w-full font-sans overflow-hidden text-black pb-6">
{/* Left Panel */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-100 z-30 transition-transform duration-700 pb-36
          flex flex-col justify-center items-center gap-10 p-8
          ${valid ? "-translate-x-full" : "translate-x-0"}
          lg:static lg:translate-x-0 lg:w-1/2 lg:h-full lg:z-auto`}
      >
        <div className="text-center text-4xl font-heading font-Adamina mb-6">
          Download YouTube Videos, Amma <span className="text-xs">by Unni</span>
        </div>

        <p className="text-center text-xl lg:max-w-full max-w-3/4">
          Copy YouTube video link (long press or right click on video, then
          &ldquo;Copy Link&rdquo;) and paste below
        </p>

        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(""); // Clear error on typing
          }}
          className="w-full max-w-md p-3 border rounded mb-2"
        />

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!url || loading}
          className="font-bold cursor-pointer bg-gradient-to-r from-teal-300 to-sky-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Download Link ->"}
        </button>
        <footer className="lg:invisible w-full text-center font-semibold bg-gradient-to-r from-teal-300 to-sky-800 text-white text-xs py-1 fixed bottom-0 left-0">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://www.ankitjohn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200"
          >
            Ankit John Abraham
          </a>
          . All rights reserved.
        </footer>
      </div>

      {/* Right Panel */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-20 transition-transform duration-700
          flex flex-col justify-center pb-36 items-center gap-8 p-8 text-center
          ${valid ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0 lg:w-2/3 lg:h-full lg:z-auto`}
      >
        {info && (
          <>
            {info?.title && (
              <h2 className="text-2xl font-heading mb-4">
                Title -{" "}
                <span className="font-sans font-semibold">{info.title}</span>
              </h2>
            )}

            {info.duration && (
              <p className="text-gray-600 mb-2 font-medium">
                Duration: {Math.floor(info.duration / 60)}:
                {Math.floor(info.duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            )}

            <div className="relative w-64 lg:w-96 h-36 lg:h-64 mb-6">
              <Image
                src={info.thumbnail || "/placeholder.jpeg"}
                alt="thumbnail"
                fill
                className="rounded shadow object-cover"
                priority
                sizes="256px"
              />
            </div>
            {info.duration && (
              <button
                onClick={handleDownload}
                className="block font-bold bg-gradient-to-r from-teal-300 to-sky-800 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                Download Now
              </button>
            )}
            {downloaded && (
              <div className="text-green-500 text-lg font-semibold mt-4">
                MP3 file is being downloaded or has been downloaded!
              </div>
            )}
          </>
        )}
        <footer className="lg:invisible w-full text-center font-semibold bg-gradient-to-r from-teal-300 to-sky-800 text-white text-xs py-1 fixed bottom-0 left-0">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://www.ankitjohn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200"
          >
            Ankit John Abraham
          </a>
          . All rights reserved.
        </footer>
      </div>
      <footer className="w-full text-center font-semibold bg-gradient-to-r from-teal-300 to-sky-800 text-white text-xs py-1 fixed bottom-0 left-0">
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://www.ankitjohn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-200"
        >
          Ankit John Abraham
        </a>
        . All rights reserved.
      </footer>
    </main>
  );
}
