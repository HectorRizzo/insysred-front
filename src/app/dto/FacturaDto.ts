import { ClienteDto } from './ClienteDto';
import { ContratoDto } from './ContratoDto';
import { DescuentoFacturaDto } from './DescuentoFacturaDto';
import { DetalleFacturaDto } from './DetalleFacturaDto';
import { FacturaPromesaPagoDto } from './FacturaPromesaPagoDto';
import { PeriodoDto } from './PeriodoDto';
import { ReciboDto } from './ReciboDto';

export interface FacturaDto {
  id: number;
  cliente: ClienteDto;
  contrato: ContratoDto;
  valor: number;
  iva: number;
  total: number;
  estado: string;
  saldo: number;
  periodo: PeriodoDto;
  fechaEmision: Date;
  fechaPreCorte: Date;
  fechaVencimiento: Date;
  detalleFacturas: DetalleFacturaDto[];
  promesasPago: FacturaPromesaPagoDto[];
  descuentosFactura: DescuentoFacturaDto[];
  recibos: ReciboDto[];
}
