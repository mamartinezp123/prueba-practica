import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Entity()
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  descripcion: string;
  @Column()
  fechaFundacion: Date;
  @Column()
  urlPaginaWeb: string;
  @ManyToMany(
    () => AeropuertoEntity,
    (aeropuerto: AeropuertoEntity) => aeropuerto.aerolineas,
  )
  @JoinTable()
  aeropuertos: AeropuertoEntity[];
}
