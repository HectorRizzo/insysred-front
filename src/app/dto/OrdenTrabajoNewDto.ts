import { EmpleadosDTO } from './EmpleadosDTO';

export interface  OrdenTrabajoNewDto{
  id?: number;
  sucursal: number;
  cliente: number;
  fechaVisita: string;
  horaVisita: any;
  motivo: any;
  tecnicos:any;
  personaContacto: string;
  telefonoContacto: string;
  direccionReferencia:string;
  referenciaDireccion:string;
  contrato: any;
  celularContacto?: string;
  direccion?: string;
  codigoCliente?: any;
  lsTecnicos?: any;
}
