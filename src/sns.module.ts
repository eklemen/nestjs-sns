import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SnsService } from './sns.service';
import { SNS_OPTIONS } from './sns.constants';
import * as optionTypes from './interfaces';

@Module({})
export class SnsModule {
  static register(options: optionTypes.SnsOptions): DynamicModule {
    const { isGlobal, ...snsOptions} = options;
    return {
      module: SnsModule,
      providers: [
        {
          provide: SNS_OPTIONS,
          useValue: snsOptions,
        },
        SnsService,
      ],
      exports: [SnsService],
      global: isGlobal,
    };
  }

  static registerAsync(options: optionTypes.SnsAsyncOptions): DynamicModule {
    const { isGlobal, ...snsOptions} = options;
    const asyncOpts = this.createAsyncProviders(snsOptions);
    return {
      module: SnsModule,
      imports: options.imports,
      providers: [SnsService, ...asyncOpts],
      exports: [SnsService],
      global: options.isGlobal,
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
