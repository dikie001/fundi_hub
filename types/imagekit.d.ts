declare module "@imagekit/next" {
  export type ImageKitUploadResponse = {
    url: string
    fileId: string
    name: string
  }

  export default class ImageKit {
    constructor(config: {
      publicKey?: string
      privateKey?: string
      urlEndpoint?: string
    })
    upload(options: {
      file: string
      fileName?: string
      folder?: string
    }): Promise<ImageKitUploadResponse>
  }
}
