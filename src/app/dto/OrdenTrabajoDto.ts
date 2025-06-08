import { SucursalDto } from './SucursalDto';
import { ContratoDto } from './ContratoDto';
import { ClienteDto } from './ClienteDto';
import { UsuarioDto } from './UsuarioDto';
import { HoraVisitaDto } from './HoraVisitaDto';
import { MotivoVisitaDto } from './MotivoVisitaDto';

export interface OrdenTrabajoDto {
  id: number;
  codigo: number;
  numOrden: OrdenTrabajoDto;
  sucursal: SucursalDto;
  contrato: ContratoDto;
  codigoCliente: ClienteDto;
  fechaVisita: string;
  horaVisita: HoraVisitaDto;
  personaContacto: string;
  celularContacto: string;
  estadoOrden: string;
  motivo: MotivoVisitaDto;
  esActivo: boolean;
  fechaCrea: string;
  direccion: string;
  tecnico: UsuarioDto;
  referenciaDireccion:string;
}
