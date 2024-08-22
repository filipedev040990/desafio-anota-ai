import { SendMessageRequest, SQSClient, SendMessageCommand, ReceiveMessageCommand, ReceiveMessageRequest, DeleteMessageRequest, DeleteMessageCommand, CreateQueueRequest, CreateQueueCommand } from '@aws-sdk/client-sqs'
import { logger } from '@/shared/helpers/logger.helper'
import { QueueInterface } from '@/domain/interfaces/queue/queue.interface'
import { CreateBucketCommand, CreateBucketRequest, PutPublicAccessBlockCommand, S3Client } from '@aws-sdk/client-s3'

export class AwsSqsAdapter implements QueueInterface {
  private readonly sqsClient: SQSClient
  private readonly s3Client: S3Client

  constructor () {
    this.sqsClient = this.getSQSClient()
    this.s3Client = this.getS3Client()
  }

  async sendMessage (queueName: string, message: string, messageGroupId: string, messageDeduplicationId: string): Promise<boolean> {
    const input: SendMessageRequest = {
      QueueUrl: `${process.env.AWS_SQS_URL}${queueName}`,
      MessageBody: message,
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: messageDeduplicationId
    }

    const command = new SendMessageCommand(input)
    const sendMessage = await this.sqsClient.send(command)

    return !!sendMessage
  }

  async receiveMessage (queueName: string, maxNumberOfMessages: number, waitTimeSeconds: number): Promise<any> {
    const input: ReceiveMessageRequest = {
      QueueUrl: `${process.env.AWS_SQS_URL}${queueName}`,
      MaxNumberOfMessages: maxNumberOfMessages,
      WaitTimeSeconds: waitTimeSeconds,
      AttributeNames: ['All']
    }

    const command = new ReceiveMessageCommand(input)
    const messages = await this.sqsClient.send(command)

    if (messages?.Messages) {
      logger.info(`Received message: ${messages.Messages[0].Body}`)
      return messages.Messages
    }

    return null
  }

  async deleteMessage (queueName: string, receiptHandle: string, messageId: string): Promise<void> {
    const input: DeleteMessageRequest = {
      QueueUrl: `${process.env.AWS_SQS_URL}${queueName}`,
      ReceiptHandle: receiptHandle
    }

    const command = new DeleteMessageCommand(input)
    logger.info(`Deleting message: ${messageId}`)

    await this.sqsClient.send(command)
  }

  async createQueueFIFO (queueName: string): Promise<void> {
    const input: CreateQueueRequest = {
      QueueName: queueName,
      Attributes: {
        FifoQueue: 'true',
        ContentBasedDeduplication: 'true'
      }
    }

    const command = new CreateQueueCommand(input)
    await this.sqsClient.send(command)

    logger.info(`Created Queue: ${queueName}`)
  }

  async createPublicBucket (bucketName: string): Promise<void> {
    const input: CreateBucketRequest = {
      Bucket: bucketName
    }

    const command = new CreateBucketCommand(input)
    await this.s3Client.send(command)

    const putPublicAccessBlockCommand = new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    })

    await this.s3Client.send(putPublicAccessBlockCommand)

    logger.info(`Created Public Bucket: ${bucketName}`)
  }

  private readonly awsCredentials = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!
    }
  }

  private getSQSClient (): SQSClient {
    return new SQSClient(this.awsCredentials)
  }

  private getS3Client (): S3Client {
    return new S3Client(this.awsCredentials)
  }
}
