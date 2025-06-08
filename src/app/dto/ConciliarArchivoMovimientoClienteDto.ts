export interface ConciliarArchivoMovimientoClienteDto {
  idArchivo: number;
  idBanco: number;
  numeroComprobante: number;
  valorComprobante: number;
  fechaComprobante: Date;
  aprobacion: boolean;

  idConMovClienteXMovBanco: number | undefined | null;
  idConMovCliente: number | undefined | null;
  idConMovBanco: number | undefined | null;
  anular: boolean;
}
