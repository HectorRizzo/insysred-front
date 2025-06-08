import { RepresentanteLegalDto} from "./RepresentanteLegalDto";

export interface EmpresaDto{
  id: number;
  ruc: string
  nombre: string;
  nombreComercial: string;
  direccion: string;
  isActive: boolean;
  representanteLegal: RepresentanteLegalDto;
}
