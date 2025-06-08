import { ClienteDto } from './ClienteDto';
import { ContratoDto } from './ContratoDto';
import { CreditoXFacturaDto } from './CreditoXFacturaDto';

export interface CreditoDto {
  id: number;
  contrato: ContratoDto;
  cliente: ClienteDto;
  fechaCredito: Date;
  valorCredito: number;
  saldo: number;
  estadoCredito: string;
  esConciliacion: boolean;
  fechaCreacion: Date;
  creditoXFactura: CreditoXFacturaDto[];
}
