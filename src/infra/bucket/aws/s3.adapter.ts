import { bucketInterface, createOrUpdateObjectInput } from '@/domain/interfaces/tools/bucket.interface'
import { PutObjectCommand, PutObjectRequest, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export class AwsS3Adapter implements bucketInterface {
  private readonly client: S3Client

  constructor () {
    this.client = this.getClient()
  }

  async createOrUpdateObject (input: createOrUpdateObjectInput): Promise<void> {
    const bucketInput: PutObjectRequest = {
      Bucket: input.Bucket,
      Key: input.Key,
      Body: Readable.from([input.Body]),
      ContentType: input.ContentType
    }

    const command = new PutObjectCommand(bucketInput)
    await this.client.send(command)
  }

  private getClient (): S3Client {
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
      }
    })
  }
}
