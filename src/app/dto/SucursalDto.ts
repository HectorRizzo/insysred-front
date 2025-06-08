import {EmpresaDto} from './EmpresaDto';
import {EmpresaNewDto} from "./EmpresaNewDto";

export interface SucursalDto{
  id: number;
  nombre: string;
  direccion: string;
  establecimiento: string;
  puntoEmision: string;
  secuencial: string;
  isActive: boolean;
  empresa: EmpresaNewDto | null;
}
