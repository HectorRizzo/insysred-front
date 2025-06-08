import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguridadUsuarioComponent } from './usuario/usuario.component';
import { SeguridadPermisosComponent } from './permisos/permisos.component';
import { SeguridadUsuarioNuevoComponent } from './usuario/nuevo/nuevo.component';
import { EditarUsuarioComponent } from './usuario/editar/editar.component';
import { SeguridadRolesComponent } from './roles/roles.component';
import { SeguridadRolesNuevoComponent } from './roles/nuevo/nuevo.component';
import { SeguridadRolesEditarComponent } from './roles/editar/editar.component';
import { SeguridadPermisosNuevoComponent } from './permisos/nuevo/nuevo.component';
import { SeguridadRolesVerComponent } from './roles/ver/ver.component';

const routes: Routes = [{ path: 'usuarios', component: SeguridadUsuarioComponent },
{ path: 'permisos', component: SeguridadPermisosComponent },
{ path: 'permisos/nuevo-permiso', component: SeguridadPermisosNuevoComponent },
{ path: 'nuevo', component: SeguridadUsuarioNuevoComponent },
{ path: 'editar', component: EditarUsuarioComponent },
{ path: 'roles', component: SeguridadRolesComponent },
{ path: 'nuevo', component: SeguridadRolesNuevoComponent },
{ path: 'editar', component: SeguridadRolesEditarComponent },
{ path: 'nuevo', component: SeguridadPermisosNuevoComponent },
{ path: 'ver', component: SeguridadRolesVerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
