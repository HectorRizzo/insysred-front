import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { SeguridadUsuarioComponent } from './usuario/usuario.component';
import { SeguridadPermisosComponent } from './permisos/permisos.component';
import { SeguridadUsuarioNuevoComponent } from './usuario/nuevo/nuevo.component';
import { EditarUsuarioComponent } from './usuario/editar/editar.component';
import { SeguridadRolesComponent } from './roles/roles.component';
import { SeguridadRolesNuevoComponent } from './roles/nuevo/nuevo.component';
import { SeguridadRolesEditarComponent } from './roles/editar/editar.component';
import { SeguridadPermisosNuevoComponent } from './permisos/nuevo/nuevo.component';
import { SeguridadRolesVerComponent } from './roles/ver/ver.component';
import { ModalAsignarSucursalComponent } from './usuario/components/modal-asignar-sucursal/modal-asignar-sucursal.component';
import { ModalAsignarRolComponent } from './usuario/components/modal-asignar-rol/modal-asignar-rol.component';
import { ModulosCheckComponent } from './permisos/components/modulos-check/modulos-check.component'; // Import 'ModulosCheckComponent'
import { SeguridadPermisosEditarComponent } from './permisos/editar/editar.component';
import { ModalEmpleadoComponent } from './usuario/components/modal-empleado/modal-empleado.component';
import { VerDatosComponent } from './usuario/components/ver-datos/ver-datos.component';
const COMPONENTS: any[] = [
  SeguridadUsuarioComponent,
  SeguridadPermisosComponent, 
  SeguridadUsuarioNuevoComponent, 
  EditarUsuarioComponent, 
  ModalAsignarSucursalComponent,
  ModalAsignarRolComponent,
  ModalEmpleadoComponent,
  VerDatosComponent,
  SeguridadRolesComponent, 
  SeguridadRolesNuevoComponent, 
  SeguridadRolesEditarComponent, 
  SeguridadPermisosNuevoComponent,
  SeguridadPermisosEditarComponent, 
  SeguridadRolesVerComponent,
  ModulosCheckComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    SeguridadRoutingModule,
  ],
  exports: [
    SeguridadRolesComponent,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
  ],
})
export class SeguridadModule { }
