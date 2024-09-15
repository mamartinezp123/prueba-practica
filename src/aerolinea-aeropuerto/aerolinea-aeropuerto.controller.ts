import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
  constructor(
    private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
  ) {}

  @Get(':aerolineaId/airports')
  async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaAeropuertoService.findAirportsFromAirline(
      aerolineaId,
    );
  }

  @Get(':aerolineaId/airports/:aeropuertoId')
  async findAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.findAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Post(':aerolineaId/airports/:aeropuertoId')
  async addAeropuertoToAerolinea(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.addAeropuertoToAerolinea(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Put(':aerolineaId/airports')
  async updateAirportsFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Body() aeropuertosDto: AeropuertoDto[],
  ) {
    const aeropuertos: AeropuertoEntity[] = plainToInstance(
      AeropuertoEntity,
      aeropuertosDto,
    );
    return await this.aerolineaAeropuertoService.updateAirportsFromAirline(
      aerolineaId,
      aeropuertos,
    );
  }

  @Delete(':aerolineaId/airports/:aeropuertoId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.deleteAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }
}
