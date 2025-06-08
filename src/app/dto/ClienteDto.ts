import { CantonesDto } from './CantonDto';
import { ProvinciasDto } from './provinciasDto';
import { ReferenciaDto } from './ReferenciaDto';

export interface ClienteDto {
  id: number | undefined;
  tipoDocumento: string  | undefined;
  identificacion: string | undefined;
  sexo: string | null| undefined;
  fechaNace: string |Date | undefined;
  apellidos: string | undefined;
  nombres: string | undefined;
  razonSocial: string | undefined;
  email: string | undefined;
  telfFijo: string | undefined;
  telfCelular: string | undefined;
  ubicacion: string | undefined;
  referenciaUbicacion: string | undefined;
  latitud: string | undefined;
  longitud: string | undefined;
  referencia: ReferenciaDto | undefined;
  provincia: ProvinciasDto | undefined;
  canton: CantonesDto | undefined;
}
