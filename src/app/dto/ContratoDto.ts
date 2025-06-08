import { Plan } from 'app/services/plans.service';
import { ClienteDto } from './ClienteDto';
import { SucursalDto } from './SucursalDto';

export interface ContratoDto {
  numContrato: number;
  cliente: ClienteDto;
  sucursal: SucursalDto;
  // servidor: RoutersDto;
  plan: Plan;
  longitud: string;
  latitud: string;
  referencia: string;
  ip: string;
  mac: string;
  fechaCrea: Date;
  fechaModifica: Date;
  fechaContrato: Date;
  fechaInstala: Date;
  fechaFin: Date;
  isActive: boolean;
  estadoContrato: string;
  envioMicrotick: boolean;
}
