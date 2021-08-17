import * as sns from '@aws-sdk/client-sns';

const mMetaData = {
  httpStatusCode: 200,
};
export const mPublishCommand: sns.PublishCommandOutput = {
  MessageId: 'test-id',
  SequenceNumber: '123456',
  $metadata: mMetaData,
};

export const mCreateTopicReponse: sns.CreateTopicCommandOutput = {
  TopicArn: 'new-topic-arn',
  $metadata: mMetaData,
};
