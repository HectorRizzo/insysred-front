import {SucursalDto} from './SucursalDto';

export interface RouterNewDto {
  nombre: string;
  usuario: string;
  password: string;
  ip: string,
  puerto: number;
  gateway: string;
  isActive: boolean,
  sucursal: number
}
