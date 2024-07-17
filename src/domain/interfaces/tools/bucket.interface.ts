export type createOrUpdateObjectInput = {
  Bucket: string
  Key: string
  Body: any
  ContentType: string
}

export type getObjectInput = {
  bucket: string
  key: string
}

export interface bucketInterface {
  createOrUpdateObject: (input: createOrUpdateObjectInput) => Promise<void>
}
