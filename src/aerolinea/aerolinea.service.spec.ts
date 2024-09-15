import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config.t';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineas: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();
    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineas = [];
    for (let i: number = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: `${faker.company.name()} Airlines`,
        descripcion: faker.lorem.sentences(3),
        fechaFundacion: faker.date.between({
          from: new Date('2020-01-01'),
          to: new Date('2024-01-01'),
        }),
        urlPaginaWeb: `https://www.${faker.internet.domainName()}`,
      });
      aerolineas.push(aerolinea);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las aerolíneas', async () => {
    const aerolinea: AerolineaEntity[] = await service.findAll();
    expect(aerolinea).not.toBeNull();
    expect(aerolinea).toHaveLength(aerolineas.length);
  });

  it('findOne debe retornar una aerolínea por id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineas[0];
    const aerolinea: AerolineaEntity = await service.findOne(
      storedAerolinea.id,
    );
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre);
  });

  it('findOne debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('create debe retornar una nueva aerolínea', async () => {
    const aerolinea: Partial<AerolineaEntity> = {
      nombre: `${faker.company.name()} Airlines`,
      descripcion: faker.lorem.sentences(3),
      fechaFundacion: faker.date.between({
        from: new Date('2020-01-01'),
        to: new Date('2024-01-01'),
      }),
      urlPaginaWeb: `https://www.${faker.internet.domainName()}`,
    };
    const newAerolinea: AerolineaEntity = await service.create(
      aerolinea as AerolineaEntity,
    );
    expect(newAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion);
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion);
    expect(storedAerolinea.urlPaginaWeb).toEqual(newAerolinea.urlPaginaWeb);
  });

  it('update debe modificar una aerolínea', async () => {
    const aerolinea: AerolineaEntity = aerolineas[0];
    aerolinea.nombre = 'Nuevo';
    const updatedAerolinea: AerolineaEntity = await service.update(
      aerolinea.id,
      aerolinea,
    );
    expect(updatedAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre);
  });

  it('update debe lanzar una excepción para una aerolínea no válida', async () => {
    await expect(() => service.update('0', null)).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });

  it('delete debe quitar una aerolínea', async () => {
    const aerolinea: AerolineaEntity = aerolineas[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete debe lanzar una excepción para una aerolínea no válida', async () => {
    const aerolinea: AerolineaEntity = aerolineas[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id dado no fue encontrada',
    );
  });
});
