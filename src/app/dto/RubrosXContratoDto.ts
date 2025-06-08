import { FacturaDto } from './FacturaDto';
import { RubroDto } from './RubroDto';

export interface RubrosXContratoDto {
  id: number;
  rubro: RubroDto;
  cantidad: number;
  fechaAsignacion: Date;
  estado: string;
  factura: FacturaDto;
}
