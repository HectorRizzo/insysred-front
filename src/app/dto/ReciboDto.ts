import { FacturaDto } from './FacturaDto';

export interface ReciboDto {
  id: number;
  fechaPago: Date;
  formaPago: string;
  tipoPago: string;
  banco: string;
  numeroComprobante: string;
  fechaComprobante: Date;
  valor: number;
}
