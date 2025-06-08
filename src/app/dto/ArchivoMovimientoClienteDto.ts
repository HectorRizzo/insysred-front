import { ClienteDto } from './ClienteDto';
import { ContratoDto } from './ContratoDto';
import { TipoBancoDto } from './TipoBancoDto';

export interface ArchivoMovimientoClienteDto {
  id: number;
  cliente: ClienteDto;
  contrato: ContratoDto;
  nombreOriginal: string;
  extension: string;
  banco: TipoBancoDto;
  numeroComprobante: number;
  valorComprobante: number;
  fechaComprobante: Date;
  aprobacion: boolean;
  estadoConciliacion: string;
  fechaCreacion: Date;
  isActive: boolean;
}
