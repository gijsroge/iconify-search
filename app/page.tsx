"use client"

import * as React from "react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { IconifySearch } from "@/registry/new-york/blocks/iconify-search/iconify-search"

export default function Home() {
  const [singleValue, setSingleValue] = React.useState<string[]>([])
  const [singleQuery, setSingleQuery] = React.useState("")
  const [multipleValue, setMultipleValue] = React.useState<string[]>([])
  const [multipleQuery, setMultipleQuery] = React.useState("")

  const debug = {
    single: { value: singleValue, searchQuery: singleQuery },
    multiple: { value: multipleValue, searchQuery: multipleQuery },
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Iconify Search</h1>
        <p className="text-muted-foreground">
          Search and browse icons from the Iconify API.
        </p>
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
  )
}
