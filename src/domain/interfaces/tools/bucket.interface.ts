export type createOrUpdateObjectInput = {
  Bucket: string
  Key: string
  Body: any
  ContentType: string
}

export interface bucketInterface {
  createOrUpdateObject: (input: createOrUpdateObjectInput) => Promise<void>
}
