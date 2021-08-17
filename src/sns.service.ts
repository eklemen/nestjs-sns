import { Inject, Injectable } from '@nestjs/common';
import * as sns from '@aws-sdk/client-sns';
import { SNS_OPTIONS } from './sns.constants';
import { CreateTopicCommand, PublishCommand } from '@aws-sdk/client-sns';
import * as snsTypes from './sns.types';

@Injectable()
export class SnsService {
  public snsClient: any;

  constructor(
    @Inject(SNS_OPTIONS) private options: sns.SNSClientConfig,
  ) {
    this.snsClient = new sns.SNSClient(options);
  }

  public async createTopic(params: sns.CreateTopicInput): Promise<snsTypes.CreateTopicResponse> {
    return this.snsClient.send(new CreateTopicCommand(params));
  }

  public async publish(params: sns.PublishInput): Promise<snsTypes.PublishResponse> {
    return this.snsClient.send(new PublishCommand(params));
  }
}
