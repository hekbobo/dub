import { useState } from "react";
import useLocalStorage from "@/lib/use-local-storage";
import VercelEdgeFunctions from "@/components/vercel-edge-functions";
import LinkCard from "@/components/link-card";
import LoadingDots from "@/components/loading-dots";

export default function Home() {
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");
  const [hashes, setHashes] = useLocalStorage<{ key: string; url: string }[]>(
    "hashes",
    []
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="my-5 text-center max-w-md">
        <h1 className="text-6xl font-bold">Dub</h1>
        <p className="text-gray-600 text-xl mt-5">
          An open-source link shortener built with <br />
          <VercelEdgeFunctions /> and{" "}
          <a
            className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700
"
            href="https://upstash.com/redis"
            target="_blank"
            rel="noreferrer"
          >
            Upstash Redis
          </a>
          .
        </p>
      </div>
      <form
        className="w-96"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          fetch(`/api/links?url=${url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (response) => {
            setSaving(false);
            if (response.ok) {
              const json = await response.json();
              setHashes([...hashes, json]);
              setUrl("");
            }
          });
        }}
      >
        <div className="mt-1 relative flex items-center">
          <input
            type="url"
            placeholder="Shorten your link"
            value={url}
            onInput={(e) => {
              setUrl((e.target as HTMLInputElement).value);
            }}
            required
            className="peer shadow-sm focus:outline-none focus:ring-0 border focus:border-black block w-full p-2 text-sm border-gray-200 rounded-md pl-3 pr-12"
          />
          <button
            type="submit"
            disabled={saving}
            className={`${
              saving ? "cursor-not-allowed" : ""
            } absolute inset-y-0 right-0 flex my-1.5 mr-1.5 items-center border border-gray-200 hover:border-gray-700 peer-focus:border-gray-700 rounded px-2 text-sm font-sans font-medium text-gray-400 hover:text-gray-700 peer-focus:text-gray-700`}
          >
            {saving ? <LoadingDots color="#e5e7eb" /> : <p>↵</p>}
          </button>
        </div>
      </form>

      <div className="grid gap-2 mt-3 w-96">
        {hashes.slice(0, 2).map(({ key, url }) => (
          <LinkCard key={key} _key={key} url={url} />
        ))}
      </div>
    </main>
  );
}