declare module 'imagekit' {
  export class ImageKit {
    constructor(config: { publicKey?: string; privateKey?: string; urlEndpoint?: string })
    upload(options: { file: string; fileName?: string; folder?: string }): Promise<any>
  }
  const _default: any
  export default _default
}
