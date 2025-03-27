"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { captureScreenshot } from "@/app/actions"
import { Loader2, Download, Globe } from "lucide-react"
import Image from "next/image"

export default function ScreenshotCapture() {
  const [url, setUrl] = useState("")
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate URL
      let validUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        validUrl = `https://${url}`
      }

      const result = await captureScreenshot(validUrl)
      if (result.success) {
        setScreenshotUrl(result.imageUrl || null)
      } else {
        setError(result.error || "Failed to capture screenshot")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Website Screenshot Tool
          </CardTitle>
          <CardDescription>Enter a URL to capture a screenshot of any website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !url}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    "Capture Screenshot"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

          {screenshotUrl && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Screenshot Preview</h3>
              <div className="border rounded-md overflow-hidden">
                <Image
                  src={screenshotUrl || "/placeholder.svg"}
                  alt="Website Screenshot"
                  width={800}
                  height={600}
                  className="w-full object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
        {screenshotUrl && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const link = document.createElement("a")
                link.href = screenshotUrl
                link.download = `screenshot-${new Date().getTime()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Save to Desktop
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

