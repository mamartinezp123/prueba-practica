import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config.t';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();
    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
    aeropuertos = [];
    for (let i: number = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: `${faker.location.city()} International Airport`,
        codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertos.push(aeropuerto);
    }
    aerolinea = await aerolineaRepository.save({
      nombre: `${faker.company.name()} Airlines`,
      descripcion: faker.lorem.sentences(3),
      fechaFundacion: faker.date.between({
        from: new Date('2020-01-01'),
        to: new Date('2024-01-01'),
      }),
      urlPaginaWeb: `https://www.${faker.internet.domainName()}`,
      aeropuertos: aeropuertos,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoToAerolinea debe asociar un aeropuerto a una aerolínea', async () => {
    const aerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: `${faker.company.name()} Airlines`,
      descripcion: faker.lorem.sentences(3),
      fechaFundacion: faker.date.between({
        from: new Date('2020-01-01'),
        to: new Date('2024-01-01'),
      }),
      urlPaginaWeb: `https://www.${faker.internet.domainName()}`,
    });
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: `${faker.location.city()} International Airport`,
      codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    const result: AerolineaEntity = await service.addAeropuertoToAerolinea(
      aerolinea.id,
      aeropuerto.id,
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(aerolinea.nombre);
    expect(result.descripcion).toBe(aerolinea.descripcion);
    expect(result.fechaFundacion).toStrictEqual(aerolinea.fechaFundacion);
    expect(result.urlPaginaWeb).toBe(aerolinea.urlPaginaWeb);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(aeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toBe(aeropuerto.codigo);
    expect(result.aeropuertos[0].pais).toBe(aeropuerto.pais);
    expect(result.aeropuertos[0].ciudad).toBe(aeropuerto.ciudad);
  });

  it('addAeropuertoToAerolinea debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() =>
      service.addAeropuertoToAerolinea('0', aeropuertos[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('addAeropuertoToAerolinea debe lanzar una excepción para un aeropuerto no válido', async () => {
    await expect(() =>
      service.addAeropuertoToAerolinea(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('updateAirportsFromAirline debe actualizar un aeropuerto a una aerolínea', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: `${faker.location.city()} International Airport`,
      codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    const result: AerolineaEntity = await service.updateAirportsFromAirline(
      aerolinea.id,
      [aeropuerto],
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(aerolinea.nombre);
    expect(result.descripcion).toBe(aerolinea.descripcion);
    expect(result.fechaFundacion).toStrictEqual(aerolinea.fechaFundacion);
    expect(result.urlPaginaWeb).toBe(aerolinea.urlPaginaWeb);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(aeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toBe(aeropuerto.codigo);
    expect(result.aeropuertos[0].pais).toBe(aeropuerto.pais);
    expect(result.aeropuertos[0].ciudad).toBe(aeropuerto.ciudad);
  });

  it('updateAirportsFromAirline debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() =>
      service.updateAirportsFromAirline('0', null),
    ).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('updateAirportsFromAirline debe lanzar una excepción para un aeropuerto no válido', async () => {
    const aeropuerto: Partial<AeropuertoEntity> = {
      id: '0',
    };
    await expect(() =>
      service.updateAirportsFromAirline(aerolinea.id, [
        aeropuerto as AeropuertoEntity,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('findAirportsFromAirline debe retornar todas las aeropuertos de una aerolínea', async () => {
    const result: AeropuertoEntity[] = await service.findAirportsFromAirline(
      aerolinea.id,
    );
    expect(result).not.toBeNull();
    expect(result.length).toBe(aeropuertos.length);
  });

  it('findAirportsFromAirline debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('findAirportFromAirline debe retornar un aeropuerto de una aerolínea', async () => {
    const result: AeropuertoEntity = await service.findAirportFromAirline(
      aerolinea.id,
      aeropuertos[0].id,
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(aeropuertos[0].nombre);
    expect(result.codigo).toBe(aeropuertos[0].codigo);
    expect(result.pais).toBe(aeropuertos[0].pais);
    expect(result.ciudad).toBe(aeropuertos[0].ciudad);
  });

  it('findAirportFromAirline debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() =>
      service.findAirportFromAirline('0', aeropuertos[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('findAirportFromAirline debe lanzar una excepción para un aeropuerto no válido', async () => {
    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('findAirportFromAirline debe lanzar una excepción para un aeropuerto no asociado', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: `${faker.location.city()} International Airport`,
      codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no está asociado a la aerolínea',
    );
  });

  it('deleteAirportFromAirline debe eliminar un aeropuerto de una aerolínea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertos[0];

    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos'],
    });
    const deletedAeropuerto: AeropuertoEntity =
      storedAerolinea.aeropuertos.find(
        (entity: AeropuertoEntity) => entity.id === aeropuerto.id,
      );
    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAirportFromAirline debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() =>
      service.deleteAirportFromAirline('0', aeropuertos[0].id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('deleteAirportFromAirline debe lanzar una excepción para un aeropuerto no válido', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAirportFromAirline debe lanzar una excepción para un aeropuerto no asociado', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: `${faker.location.city()} International Airport`,
      codigo: faker.string.alpha({ length: 3, casing: 'upper' }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no está asociado a la aerolínea',
    );
  });
});
