"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [valid, setValid] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return;
    setLoading(true);
    const res = await fetch(`/api/fetch-info?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setInfo(data);
    setValid(true);
    setLoading(false);
  };

  return (
    <main
      className="flex h-screen overflow-hidden font-sans transition-all duration-500"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Left panel */}

      <div
        className={`flex gap-12 flex-col justify-center items-center w-full md:w-1/2 p-10 bg-gray-100 transition-transform duration-500 ${
          valid ? "-translate-x-full md:translate-x-0" : ""
        }`}
      >
        <div className="text-center text-4xl font-heading">
          Download YouTube Videos, Amma
        </div>
        <div className="text-center text-xl  font-sans ">
          Copy YouTube video link (long press or right click on video, then
          "Copy Link") and paste below
        </div>
        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full max-w-md p-3 border rounded mb-4"
        />
        <button
          onClick={handleSubmit}
          disabled={!url}
          className="font-bold bg-gradient-to-r from-teal-300 to-sky-800 block text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Get Download Link ->"}
        </button>
      </div>

      {/* Right panel */}
      <div
        className={`flex flex-col gap-10 justify-center items-center w-full md:w-3/4 p-10 bg-white text-center transition-transform duration-500 ${
          valid ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {info && (
          <>
            {info && (
  <h2 className="text-xl font-heading mb-4">Title - <span className="font-sans font-semibold">{info.title}</span></h2>
)}

            {info.duration && (
              <p className="text-gray-600 mb-2 font-medium">
                Duration: {Math.floor(info.duration / 60)}:
                {Math.floor(info.duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            )}
            <img
              src={info.thumbnail}
              alt="thumbnail"
              className="w-64 rounded shadow mb-6"
            />
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
