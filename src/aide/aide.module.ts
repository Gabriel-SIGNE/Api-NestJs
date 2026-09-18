import { Module } from '@nestjs/common';
import { AideController } from './aide.controller';

@Module({
  controllers: [AideController]
})
export class AideModule {}