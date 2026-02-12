"use client";

import * as React from "react";
import { Github, Star, Share } from "lucide-react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { IconifySearch } from "@/registry/new-york/blocks/iconify-search/iconify-search";

const GITHUB_REPO = "gijsroge/iconify-search";
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

function GitHubStarsButton() {
  const [stars, setStars] = React.useState<number | null>(null);
  React.useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then((data) => typeof data.stargazers_count === "number" && setStars(data.stargazers_count))
      .catch(() => {});
  }, []);
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Star className="h-4 w-4 fill-current" />
      {stars !== null ? stars.toLocaleString() : "…"}
    </a>
  );
}

function TweetButton() {
  const [tweetUrl, setTweetUrl] = React.useState(
    "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent("Iconify Search – search and pick icons from Iconify in your React app")
  );
  React.useEffect(() => {
    setTweetUrl(
      "https://twitter.com/intent/tweet?" +
        new URLSearchParams({
          text: "Iconify Search – search and pick icons from Iconify in your React app",
          url: window.location.origin,
        }).toString()
    );
  }, []);
  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Share on X"
    >
      <Share className="h-4 w-4" />
      Share
    </a>
  );
}

export default function Home() {
  const [singleValue, setSingleValue] = React.useState<string[]>([]);
  const [singleQuery, setSingleQuery] = React.useState("");
  const [multipleValue, setMultipleValue] = React.useState<string[]>([]);
  const [multipleQuery, setMultipleQuery] = React.useState("");

  const debug = {
    single: { value: singleValue, searchQuery: singleQuery },
    multiple: { value: multipleValue, searchQuery: multipleQuery },
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Iconify Search</h1>
            <p className="text-muted-foreground">
              Search and browse icons from the Iconify API.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <GitHubStarsButton />
            <TweetButton />
          </div>
        </div>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[200px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Iconify Search (single)
            </h2>
            <OpenInV0Button name="iconify-search" className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[150px]">
            <IconifySearch
              value={singleValue}
              onValueChange={setSingleValue}
              searchValue={singleQuery}
              onSearchChange={setSingleQuery}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[200px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Iconify Search (multiple)
            </h2>
            <OpenInV0Button name="iconify-search" className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[150px]">
            <IconifySearch
              multiple
              value={multipleValue}
              onValueChange={setMultipleValue}
              searchValue={multipleQuery}
              onSearchChange={setMultipleQuery}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Debug (form values)
          </h2>
          <pre className="rounded-lg border bg-muted/50 p-4 text-xs overflow-x-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
