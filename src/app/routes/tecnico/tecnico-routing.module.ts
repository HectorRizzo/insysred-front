import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenesTrabajoComponent } from './ordenes-trabajo/ordenes-trabajo.component';
import { TecnicoTecnicosComponent } from './tecnicos/tecnicos.component';
import { EquiposComponent } from './equipos/equipos.component';
import { EquiposNuevoComponent } from './equipos/nuevo/nuevo-equipo.component';
import { MarcaEquiposComponent } from './marca-equipos/marca-equipos.component';
import { AtenderOrdenTecnicoComponent } from './atender-orden/atender-orden-tecnico.component';

const routes: Routes = [
  { path: 'ordenes-trabajo', component: OrdenesTrabajoComponent },
  { path: 'tecnicos', component: TecnicoTecnicosComponent },
  { path: 'equipos', component: EquiposComponent },
  { path: 'equipos/nuevo-equipo', component: EquiposNuevoComponent },
  { path: 'marca-equipos', component: MarcaEquiposComponent },
  { path: 'atender-orden-tecnico', component: AtenderOrdenTecnicoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TecnicoRoutingModule { }
