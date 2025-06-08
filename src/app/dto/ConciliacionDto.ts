import { DetalleArchivoBancoDto } from './ArchivoBancoDto';
import { ArchivoMovimientoClienteDto } from './ArchivoMovimientoClienteDto';
import { ClienteDto } from './ClienteDto';
import { ContratoDto } from './ContratoDto';

export interface ConciliacionDto {
  id: number;
  archivoMovimientoCliente: ArchivoMovimientoClienteDto;
  detalleArchivoBanco: DetalleArchivoBancoDto;
  numeroComprobante: number;
  valorComprobante: number;
  fechaComprobante: Date;
  referenciaComprobante: string;
  cliente: ClienteDto;
  contrato: ContratoDto;
  fechaCreacion: Date;
  fechaModificacion: Date;
  isActive: boolean;
}
