import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly repository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.repository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity = await this.repository.findOne({
      where: { id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    return await this.repository.save(aeropuerto);
  }

  async update(
    id: string,
    aeropuerto: AeropuertoEntity,
  ): Promise<AeropuertoEntity> {
    const persistedAeropuerto: AeropuertoEntity = await this.repository.findOne(
      {
        where: { id },
      },
    );
    if (!persistedAeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    aeropuerto.id = id;
    return await this.repository.save({
      ...persistedAeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string) {
    const aeropuerto: AeropuertoEntity = await this.repository.findOne({
      where: { id },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return await this.repository.remove(aeropuerto);
  }
}
