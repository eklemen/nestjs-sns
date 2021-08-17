import { Test, TestingModule } from '@nestjs/testing';
import { SnsService } from '../sns.service';
import { SNS_OPTIONS } from '../sns.constants';
import * as sns from '@aws-sdk/client-sns';
import * as fixtures from './fixtures';

jest.mock('@aws-sdk/client-sns', () => {
  const mSns = {
    send: jest.fn(),
  };
  return {
    SNSClient: jest.fn(() => mSns),
    PublishCommand: jest.fn(() => fixtures.mPublishCommand),
    CreateTopicCommand: jest.fn(() => fixtures.mCreateTopicReponse),
  };
});

describe('SnsService', () => {
  let service: SnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnsService,
        {
          provide: SNS_OPTIONS,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SnsService>(SnsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('#createTopic', () => {
    test('pass params through to CreateTopicCommand and call send', async () => {
      expect(service.createTopic).toBeDefined();
      const createTopicInput = {
        Name: 'MyNewTopic',
      };
      await service.createTopic(createTopicInput);
      expect(sns.CreateTopicCommand).toHaveBeenCalledWith(createTopicInput);
      expect(service.snsClient.send)
        .toHaveBeenCalledWith(new sns.CreateTopicCommand(createTopicInput));
    });
  });
  describe('#publish', () => {
    test('pass params through to PublishCommand and call send', async () => {
      expect(service.publish).toBeDefined();
      const publishInput = {
        Message: 'Test Message',
        TopicArn: 'test-arn',
      };
      await service.publish(publishInput);
      expect(sns.PublishCommand).toHaveBeenCalledWith(publishInput);
      expect(service.snsClient.send)
        .toHaveBeenCalledWith(new sns.PublishCommand(publishInput));
    });
  });
});
