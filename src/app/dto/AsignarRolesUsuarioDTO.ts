import { RolesUsuarioDTO } from './RolesUsuarioDTO';

export interface AsignarRolesUsuarioDTO{
    idUsuario: number;
    idSucursal: number| null;
    roles: RolesUsuarioDTO[];
}