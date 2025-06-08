import { CantonesDto } from './CantonDto';
import { ProvinciasDto } from './provinciasDto';

export interface ReferenciaDto {
    id: number | undefined;
    nombres: string | undefined;
    apellidos: string | undefined;
    parentesco: string | undefined;
    telfFijo: string | undefined;
    telfMovil: string | undefined;
    direccion: string | undefined;
    provincia: ProvinciasDto | undefined;
    canton: CantonesDto | undefined;
    }