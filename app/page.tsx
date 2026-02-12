"use client";

import * as React from "react";
import { Github, Star, Share, Copy, Check } from "lucide-react";
import { IconifySearch } from "@/registry/new-york/blocks/iconify-search/iconify-search";
import { Button } from "@/components/ui/button";

const GITHUB_REPO = "gijsroge/iconify-search";
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
const SHADCN_ADD_CMD =
  'npx shadcn@latest add "https://gijsroge.github.io/iconify-search/r/iconify-search.json"';

function GitHubStarsButton() {
  const [stars, setStars] = React.useState<number | null>(null);
  React.useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then(
        (data) =>
          typeof data.stargazers_count === "number" &&
          setStars(data.stargazers_count)
      )
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
      encodeURIComponent(
        "Iconify Search – search and pick icons from Iconify in your React app"
      )
  );
  React.useEffect(() => {
    setTweetUrl(
      "https://twitter.com/intent/tweet?" +
        new URLSearchParams({
          text: "Iconify Search – search and pick icons from Iconify in your React app",
          url: window.location.origin + window.location.pathname,
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

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={copy}
      className="overflow-hidden justify-start"
      aria-label="Copy command"
    >
      <code className="min-w-0 flex-1 break-all py-0.5 truncate text-left">
        {command}
      </code>
      <span className="flex items-center gap-2 size-5 shrink-0">
        {copied ? (
          <Check
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        ) : (
          <Copy
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
      </span>
    </Button>
  );
}

export default function Home() {
  const [singleValue, setSingleValue] = React.useState<string[]>([]);
  const [singleQuery, setSingleQuery] = React.useState("");
  const [multipleValue, setMultipleValue] = React.useState<string[]>([]);
  const [multipleQuery, setMultipleQuery] = React.useState("");

  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-y-6 gap-x-4 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight m-0">
            Iconify search
          </h1>

          <div className="flex items-center gap-2 m-0">
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

        <p className="text-muted-foreground max-w-xl m-0">
          Search and pick icons from{" "}
          <a
            href="https://iconify.design"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Iconify
          </a>{" "}
          in your React app. Use the ready-to-use shadcn block below, or the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
            @gijsroge/iconify-search
          </code>{" "}
          package with a renderless primitive to build your own UI.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Add the block to your shadcn project:
          </span>
          <CopyCommand command={SHADCN_ADD_CMD} />
        </div>
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[200px] relative">
          <h2 className="text-sm text-muted-foreground sm:pl-3">
            Iconify Search (single)
          </h2>
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
          <h2 className="text-sm text-muted-foreground sm:pl-3">
            Iconify Search (multiple)
          </h2>
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
      </main>
      <footer className="text-muted-foreground text-sm text-center pt-4 pb-2">
        If you find Iconify useful, please consider{" "}
        <a
          href="https://iconify.design/sponsors/"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-4 hover:text-foreground"
        >
          supporting the project
        </a>
        .
      </footer>
    </div>
  );
}
