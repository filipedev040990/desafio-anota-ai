import { AwsSqsAdapter } from '@/infra/queue/aws/sqs.adapter'
import constants from '@/shared/constants'

export const createQueueFIFO = async (): Promise<boolean> => {
  try {
    const sqs = new AwsSqsAdapter()
    constants.AWS_FIFO_QUEUES.map(async (queue) => {
      await sqs.createQueueFIFO(queue)
    })
    return true
  } catch (error) {
    return false
  }
}
