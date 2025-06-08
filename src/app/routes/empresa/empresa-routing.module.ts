import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresaAdministracionComponent } from './administracion/administracion.component';
import { EmpresaSucursalComponent } from './sucursal/sucursal.component';
import { EmpresaUtilComponent } from './util/util.component';
import { EmpresaSucursalNuevoComponent } from './sucursal/nuevo/nuevo.component';
import { EmpresaAdministracionEditarComponent } from './administracion/editar/editar.component';
import { EmpresaSucursalEditarComponent } from './sucursal/editar/editar.component';
import { EmpresaSucursalVerComponent } from './sucursal/ver/ver.component';
import { EmpresaServidoresComponent } from './servidores/servidores.component';
import { EmpresaServidoresVerComponent } from './servidores/ver/ver.component';
import { EmpresaServidoresNuevoComponent } from './servidores/nuevo/nuevo.component';
import { EmpresaServidoresEditComponent } from './servidores/edit/edit.component';
import { EmpresaServidoresAsignarComponent } from './servidores/asignar/asignar.component';
import { EmpresaServidoresConfigurarComponent } from './servidores/configurar/configurar.component';
import { EmpresaServidoresConfigurarMangleComponent } from './servidores/configurar/mangle/mangle.component';
import { EmpresaServidoresConfigurarQueueComponent } from './servidores/configurar/queue/queue.component';
import { EmpresaServidoresConfigurarFirewallComponent } from './servidores/configurar/firewall/firewall.component';
import { EmpresaServidoresConfigurarInterfazComponent } from './servidores/configurar/interfaz/interfaz.component';
import { CargosDepartamentosComponent } from './departamentos-cargos/cargos-departamentos.component';
import { EmpleadosComponent } from './empleados/empleados.component';

const routes: Routes = [{ path: 'administracion', component: EmpresaAdministracionComponent },
{ path: 'sucursal', component: EmpresaSucursalComponent },
{ path: 'util', component: EmpresaUtilComponent },
{ path: 'nuevo', component: EmpresaSucursalNuevoComponent },
{ path: 'editar', component: EmpresaAdministracionEditarComponent },
{ path: 'editar', component: EmpresaSucursalEditarComponent },
{ path: 'ver', component: EmpresaSucursalVerComponent },
{ path: 'servidores', component: EmpresaServidoresComponent },
{ path: 'ver', component: EmpresaServidoresVerComponent },
{ path: 'nuevo', component: EmpresaServidoresNuevoComponent },
{ path: 'edit', component: EmpresaServidoresEditComponent },
{ path: 'asignar', component: EmpresaServidoresAsignarComponent },
{ path: 'configurar', component: EmpresaServidoresConfigurarComponent },
{ path: 'mangle', component: EmpresaServidoresConfigurarMangleComponent },
{ path: 'queue', component: EmpresaServidoresConfigurarQueueComponent },
{ path: 'firewall', component: EmpresaServidoresConfigurarFirewallComponent },
{ path: 'interfaz', component: EmpresaServidoresConfigurarInterfazComponent },
{ path: 'departamentos-cargos', component: CargosDepartamentosComponent },
{ path: 'empleados', component: EmpleadosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
