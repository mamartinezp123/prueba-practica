import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config.t';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();
    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertos = [];
    for (let i: number = 0; i < 5; i++) {
      const pais: AeropuertoEntity = await repository.save({
        nombre: `${faker.location.city()} International Airport`,
        codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertos.push(pais);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los aeropuertos', async () => {
    const pais: AeropuertoEntity[] = await service.findAll();
    expect(pais).not.toBeNull();
    expect(pais).toHaveLength(aeropuertos.length);
  });

  it('findOne debe retornar un aeropuerto por id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertos[0];
    const pais: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedAeropuerto.nombre);
  });

  it('findOne debe lanzar una excepción para un aeropuerto no válido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('create debe retornar un nuevo aeropuerto', async () => {
    const aeropuerto: Partial<AeropuertoEntity> = {
      nombre: `${faker.location.city()} International Airport`,
      codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    };
    const newAeropuerto: AeropuertoEntity = await service.create(
      aeropuerto as AeropuertoEntity,
    );
    expect(newAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: newAeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre);
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo);
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais);
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad);
  });

  it('update debe modificar un aeropuerto', async () => {
    const pais: AeropuertoEntity = aeropuertos[0];
    pais.nombre = 'Nuevo';
    const updatedAeropuerto: AeropuertoEntity = await service.update(
      pais.id,
      pais,
    );
    expect(updatedAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(pais.nombre);
  });

  it('update debe lanzar una excepción para un aeropuerto no válido', async () => {
    await expect(() => service.update('0', null)).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('delete debe quitar un aeropuerto', async () => {
    const pais: AeropuertoEntity = aeropuertos[0];
    await service.delete(pais.id);
    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete debe lanzar una excepción para un aeropuerto no válido', async () => {
    const pais: AeropuertoEntity = aeropuertos[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });
});
