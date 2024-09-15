import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly repository: Repository<AerolineaEntity>,
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.repository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.repository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return aerolinea;
  }

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    return await this.repository.save(aerolinea);
  }

  async update(
    id: string,
    aerolinea: AerolineaEntity,
  ): Promise<AerolineaEntity> {
    const persistedAerolinea: AerolineaEntity = await this.repository.findOne({
      where: { id },
    });
    if (!persistedAerolinea)
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    aerolinea.id = id;
    return await this.repository.save({
      ...persistedAerolinea,
      ...aerolinea,
    });
  }

  async delete(id: string) {
    const aerolinea: AerolineaEntity = await this.repository.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return await this.repository.remove(aerolinea);
  }
}
