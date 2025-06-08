import { FacturaDto } from './FacturaDto';

export interface CreditoXFacturaDto {
  id: number;
  factura: FacturaDto;
  valorAplicado: number;
  fechaCreacion: Date;
}
