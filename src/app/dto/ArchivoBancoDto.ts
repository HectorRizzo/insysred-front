import { TipoBancoDto } from './TipoBancoDto';

export interface ArchivoBancoDto {
  id: number;
  banco: TipoBancoDto | null;
  nombre: string;
  fechaInicioCarga: Date;
  fechaFinCarga: Date;
  registrosExito: number;
  registrosError: number;
  registrosRepetido: number;
  registrosTotal: number;
  estadoCarga: string;
  detalleArchivoConciliacion: DetalleArchivoBancoDto[];
  detalleErrorArchivoConciliacion: DetalleErrorArchivoBancoDto[];
}

export interface DetalleArchivoBancoDto {
  fecha: Date;
  documento: number;
  valor: number;
  referencia: string;
  estadoConciliacion: string;
}

export interface DetalleErrorArchivoBancoDto {
  fecha: Date;
  documento: number;
  valor: number;
  referencia: string;
  mensajeError: string;
  causaError: string;
}
