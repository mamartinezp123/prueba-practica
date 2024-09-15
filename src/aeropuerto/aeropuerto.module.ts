import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  providers: [AeropuertoService],
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  controllers: [AeropuertoController],
})
export class AeropuertoModule {}
