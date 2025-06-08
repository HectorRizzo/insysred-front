import {SucursalDto} from './SucursalDto';

export interface RouterDto{
  id: number,
  nombre: string;
  usuario: string;
  password: string;
  ip: string,
  puerto: number;
  gateway: string;
  isActive: boolean,
  sucursal: SucursalDto
}
