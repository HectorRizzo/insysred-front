import { ClienteDto } from './ClienteDto';
import { ContratoDto } from './ContratoDto';
import { TipoBancoDto } from './TipoBancoDto';

export interface DetalleArchivoMovimientoClienteDto {
  id: number;
  cliente: ClienteDto;
  contrato: ContratoDto;
  nombreOriginal: string;
  banco: TipoBancoDto;
  numeroComprobante: number;
  valorComprobante: number;
  fechaComprobante: Date;
  aprobacion: boolean;
  fechaCreacion: Date;
  imagen: any;
  estadoConciliacion: string;
}
