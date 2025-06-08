export interface CambioEstadoFacturaDto {
  idFactura: number;
  estado: string;
  saldo: number;
  formaPago: string;
  tipoPago: string;
  idBanco: number;
  numeroComprobante: string;
  fechaComprobante: Date;
  valor: number;
  fechaPromesaPago: Date;
}
