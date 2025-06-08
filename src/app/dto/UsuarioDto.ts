import { RolDto } from './RolDto';
import { SucursalDto } from './SucursalDto';

export interface UsuarioDto{
  id: number;
  tipoIdentificacion: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  isActive: boolean;
  sexo: string;
  telefono: string;
  direccion: string;
  rol: RolDto;
  sucursales: SucursalDto[ ];
  activo: boolean;
}
