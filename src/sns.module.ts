import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { SNSClientConfig } from '@aws-sdk/client-sns';
import { SnsService } from './sns.service';
import { SNS_OPTIONS } from './sns.constants';
import * as optionTypes from './interfaces';

@Global()
@Module({})
export class SnsModule {
  static register(options: SNSClientConfig): DynamicModule {
    return {
      module: SnsModule,
      providers: [
        {
          provide: SNS_OPTIONS,
          useValue: options,
        },
        SnsService,
      ],
      exports: [SnsService],
    };
  }

  static registerAsync(options: optionTypes.SnsAsyncOptions): DynamicModule {
    const asyncOpts = this.createAsyncProviders(options);
    return {
      module: SnsModule,
      imports: options.imports,
      providers: [SnsService, ...asyncOpts],
      exports: [SnsService],
    };
  }

  private static createAsyncProviders(
    options: optionTypes.SnsAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: optionTypes.SnsAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SNS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: SNS_OPTIONS,
      useFactory: async (optionsFactory: optionTypes.SnsOptionsFactory) =>
        await optionsFactory.createSnsOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
