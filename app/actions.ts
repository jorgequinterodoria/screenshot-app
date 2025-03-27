"use server"

import { chromium } from "playwright"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function captureScreenshot(url: string) {
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
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })

    // Take a screenshot
    const screenshot = await page.screenshot({ fullPage: true })

    // Close browser
    await browser.close()

    // Generate a unique filename
    const filename = `screenshot-${uuidv4()}.png`
    const publicDir = path.join(process.cwd(), "public", "screenshots")
    const filePath = path.join(publicDir, filename)

    // Ensure the directory exists
    await writeFile(filePath, screenshot)

    // Return the URL to the screenshot
    return {
      success: true,
      imageUrl: `/screenshots/${filename}`,
    }
  } catch (error) {
    console.error("Error capturing screenshot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

