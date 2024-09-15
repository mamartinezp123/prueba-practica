import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  providers: [AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}
