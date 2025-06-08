import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesClienteComponent } from './cliente/cliente.component';
import { ClientesServicioComponent } from './servicio/servicio.component';
import { ClientesServicioNuevoComponent } from './servicio/nuevo/nuevo.component';
import { ClientesClienteNuevoComponent } from './cliente/nuevo/nuevo.component';
import { PlanesComponent } from './planes/planes.component';
import { CobrosComponent } from './cobros/cobros.component';
import { RubrosComponent } from './rubros/rubros.component';
import { CreditosComponent } from './creditos/creditos.component';
import { EditarClienteComponent } from './cliente/editar-cliente/editar-cliente.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesClienteComponent },
  { path: 'servicios', component: ClientesServicioComponent },
  { path: 'servicios/nuevo-servicio', component: ClientesServicioNuevoComponent },
  { path: 'clientes/nuevo-cliente', component: ClientesClienteNuevoComponent },
  { path: 'clientes/editar-cliente/:id', component: EditarClienteComponent },
  { path: 'planes', component: PlanesComponent },
  { path: 'rubros', component: RubrosComponent },
  { path: 'cobros', component: CobrosComponent },
  { path: 'creditos', component: CreditosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
