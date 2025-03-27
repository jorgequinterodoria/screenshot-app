"use server"

import { chromium } from "playwright"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

export async function captureScreenshot(urlTest: string) {
  try {
    // Launch browser
    const browser = await chromium.launch({
      headless: true,
    })

    // Create a new page
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()

    // Navigate to the URL
    if (!urlTest) {
      throw new Error("URL is required");
    }
    await page.goto(urlTest.toString(), { waitUntil: "networkidle", timeout: 30000 })

    // Take a screenshot
    const screenshot = await page.screenshot({ fullPage: true })

    // Close browser
    await browser.close()

    // Upload to Vercel Blob
    const filename = `screenshot-${uuidv4()}.png`
    const { url } = await put(filename, screenshot, {
      access: 'public',
      contentType: 'image/png'
    })

    // Return the URL to the screenshot
    return {
      success: true,
      imageUrl: url,
    }
  } catch (error) {
    console.error("Error capturing screenshot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

