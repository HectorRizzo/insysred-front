import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesoFacturaComponent } from './proceso-factura/proceso-factura.component';
import { CargarBancoComponent } from './cargar-banco/cargar-banco.component';
import { ComprobantesClienteComponent } from './comprobantes-cliente/comprobantes-cliente.component';
import { ConciliacionComponent } from './conciliacion/conciliacion.component';

const routes: Routes = [
  { path: 'proceso-factura', component: ProcesoFacturaComponent },
  { path: 'carga-banco', component: CargarBancoComponent },
  { path: 'comprobante-cliente', component: ComprobantesClienteComponent },
  { path: 'conciliacion', component: ConciliacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcesosRoutingModule {}
