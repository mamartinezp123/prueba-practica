import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async addAeropuertoToAerolinea(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity =
      await this.findAerolineaById(aerolineaId);
    const aeropuerto: AeropuertoEntity =
      await this.findAeropuertoById(aeropuertoId);

    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async updateAirportsFromAirline(
    aerolineaId: string,
    aeropuertos: AeropuertoEntity[],
  ): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity =
      await this.findAerolineaById(aerolineaId);

    for (const aeropuerto of aeropuertos) {
      await this.findAeropuertoById(aeropuerto.id);
    }

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAirportsFromAirline(
    aerolineaId: string,
  ): Promise<AeropuertoEntity[]> {
    const aerolinea: AerolineaEntity =
      await this.findAerolineaById(aerolineaId);
    return aerolinea.aeropuertos;
  }

  async findAirportFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AeropuertoEntity> {
    const aerolinea: AerolineaEntity =
      await this.findAerolineaById(aerolineaId);
    const aeropuerto: AeropuertoEntity =
      await this.findAeropuertoById(aeropuertoId);

    const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(
      (entity: AeropuertoEntity) => entity.id === aeropuerto.id,
    );
    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no está asociado a la aerolínea',
        BusinessError.PRECONDITION_FAILED,
      );
    return aerolineaAeropuerto;
  }

  async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string) {
    const aerolinea: AerolineaEntity =
      await this.findAerolineaById(aerolineaId);
    const aeropuerto: AeropuertoEntity =
      await this.findAeropuertoById(aeropuertoId);

    const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(
      (entity: AeropuertoEntity) => entity.id === aeropuerto.id,
    );
    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no está asociado a la aerolínea',
        BusinessError.PRECONDITION_FAILED,
      );

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(
      (entity: AeropuertoEntity) => entity.id !== aeropuertoId,
    );
    await this.aerolineaRepository.save(aerolinea);
  }

  private async findAerolineaById(
    aerolineaId: string,
  ): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return aerolinea;
  }

  private async findAeropuertoById(
    aeropuertoId: string,
  ): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({
        where: { id: aeropuertoId },
      });
    if (!aeropuerto) {
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return aeropuerto;
  }
}
