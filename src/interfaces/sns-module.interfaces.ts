import { ModuleMetadata, Type } from '@nestjs/common';
import * as sns from '@aws-sdk/client-sns';

export interface SnsOptionsFactory {
  createSnsOptions(): Promise<sns.SNSClientConfig> | sns.SNSClientConfig;
}
export interface SnsOptions extends sns.SNSClientConfig {
  isGlobal?: boolean;
}

export interface SnsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SnsOptionsFactory>;
  useClass?: Type<SnsOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<sns.SNSClientConfig> | sns.SNSClientConfig;
  inject?: any[];
  isGlobal?: boolean;
}
