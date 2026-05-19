declare module '@imagekit/javascript' {
  export default class ImageKit {
    constructor(config: { publicKey?: string; privateKey?: string; urlEndpoint?: string })
    upload(options: { file: string; fileName?: string; folder?: string }): Promise<any>
  }
}
      file: string
      fileName?: string
      folder?: string
    }): Promise<any>
  }
  const _default: any
  export default _default
}
