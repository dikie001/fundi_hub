import ImageKit from "imagekit"
import { NextResponse } from "next/server"

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGE_KIT_SECRET_KEY || "",
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT || "",
})

export async function POST(request: Request) {
  try {
    const { image, fileName, folder } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: "No image content provided" },
        { status: 400 }
      )
    }

    const defaultFileName = fileName || `upload_${Date.now()}.png`
    let uploadFolder = folder || "fundi_hub/profile_pics"
    // Normalize folder: ImageKit expects folder paths without a leading slash
    if (uploadFolder.startsWith("/")) {
      uploadFolder = uploadFolder.slice(1)
    }

    // ImageKit expects the base64 string without the prefix data:image/...;base64,
    let base64Data = image
    if (image.includes("base64,")) {
      base64Data = image.split("base64,")[1]
    }

    const uploadResponse = await imagekit.upload({
      file: base64Data,
      fileName: defaultFileName,
      folder: uploadFolder,
    })

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
    })
  } catch (error: unknown) {
    console.error("ImageKit upload error:", error)
    const message = error instanceof Error ? error.message : "Failed to upload image"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
