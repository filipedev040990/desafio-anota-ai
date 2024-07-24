import { AwsSqsAdapter } from '@/infra/queue/aws/sqs.adapter'
import constants from '../constants'
import { ServerError } from '../errors'
import { logger } from './logger.helper'
import { queueDeduplicationIdGenerate } from './queue.helper'

export const publishUpdateCatalogMessage = async (ownerId: string): Promise<void> => {
  const messageBody = JSON.stringify({ ownerId })
  const queueName = constants.QUEUE_EMIT_CATALOG
  const deduplicationId = queueDeduplicationIdGenerate()

  const sqs = new AwsSqsAdapter()

  const success = await sqs.sendMessage(queueName, messageBody, constants.MESSAGE_GROUP_ID, deduplicationId)

  if (!success) {
    logger.error(`Error publishing message: ${JSON.stringify(messageBody)}`)
    throw new ServerError(new Error('Error publishing message'))
  }
}
