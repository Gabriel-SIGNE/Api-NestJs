import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Avis, avisSchema, stuff, stuffSchema } from './models/Stuff';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: stuff.name, schema: stuffSchema}, { name: Avis.name, schema: avisSchema}])
  ],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
