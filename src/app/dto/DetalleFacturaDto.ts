import { Plan } from 'app/services/plans.service';
import { RubroDto } from './RubroDto';

export interface DetalleFacturaDto {
  id: number;
  plan: Plan;
  rubro: RubroDto;
  cantidad: number;
  valor: number;
}
