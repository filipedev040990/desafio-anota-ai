import { AwsSqsAdapter } from '@/infra/queue/aws/sqs.adapter'
import constants from '@/shared/constants'
import { logger } from '@/shared/helpers/logger.helper'

export const createQueueFIFO = async (): Promise<void> => {
  try {
    const sqs = new AwsSqsAdapter()
    constants.AWS_FIFO_QUEUES.map(async (queue) => {
      await sqs.createQueueFIFO(queue)
    })
  } catch (error: any) {
    logger.error('Error creating aws fifo queue')
    throw error
  }
}
