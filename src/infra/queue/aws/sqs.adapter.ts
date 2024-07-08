import { SendMessageRequest, SQSClient, SendMessageCommand, ReceiveMessageCommand, ReceiveMessageRequest, DeleteMessageRequest, DeleteMessageCommand } from '@aws-sdk/client-sqs'
import { logger } from '@/shared/helpers/logger.helper'
import { QueueInterface } from '@/domain/interfaces/queue/queue.interface'

export class AwsSqsAdapter implements QueueInterface {
  private readonly client: SQSClient

  constructor () {
    this.client = this.getClient()
  }

  async sendMessage (queueName: string, message: string, messageGroupId: string, messageDeduplicationId: string): Promise<boolean> {
    const input: SendMessageRequest = {
      QueueUrl: `${process.env.AWS_SQS_URL}${queueName}`,
      MessageBody: message,
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: messageDeduplicationId
    }

    const command = new SendMessageCommand(input)
    const sendMessage = await this.client.send(command)

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
    const messages = await this.client.send(command)

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

    await this.client.send(command)
  }

  private getClient (): SQSClient {
    return new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
      }
    })
  }
}
