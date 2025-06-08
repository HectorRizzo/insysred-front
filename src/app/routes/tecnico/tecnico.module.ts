import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TecnicoRoutingModule } from './tecnico-routing.module';
import { TecnicoTecnicosComponent } from './tecnicos/tecnicos.component';
import { EquiposComponent } from './equipos/equipos.component';
import { EquiposNuevoComponent } from './equipos/nuevo/nuevo-equipo.component';
import { EquiposEditarComponent } from './equipos/editar/editar-equipo.component';
import { MarcaEquiposComponent } from './marca-equipos/marca-equipos.component';
import { NuevaMarcaEquipoComponent } from './marca-equipos/nuevo/nueva-marca-equipo.component';
import { EditarMarcaEquipoComponent } from './marca-equipos/editar/editar-marca-equipo.component';
import { OrdenesTrabajoComponent } from './ordenes-trabajo/ordenes-trabajo.component';
import { TecnicoOrdTrabajoAtenderOrdenComponent } from './ordenes-trabajo/atender-orden/atender-orden.component';
import { TecnicoOrdTrabajoEditOrdenComponent } from './ordenes-trabajo/edit-orden/edit-orden.component';
import { TecnicoOrdTrabajoVerOrdenComponent } from './ordenes-trabajo/ver-orden/ver-orden.component';
import { ModalAsignarClienteComponent } from './ordenes-trabajo/modal-cliente/modal-asignar-cliente.component';
import { AtenderOrdenTecnicoComponent } from './atender-orden/atender-orden-tecnico.component';

const COMPONENTS: any[] = [];
const COMPONENTS_DYNAMIC: any[] = [
  OrdenesTrabajoComponent,
  TecnicoTecnicosComponent,
  EquiposComponent,
  EquiposNuevoComponent,
  EquiposEditarComponent,
  MarcaEquiposComponent,
  NuevaMarcaEquipoComponent,
  ModalAsignarClienteComponent,
  AtenderOrdenTecnicoComponent,
  EditarMarcaEquipoComponent,
  TecnicoOrdTrabajoVerOrdenComponent,
  TecnicoOrdTrabajoEditOrdenComponent,
  TecnicoOrdTrabajoAtenderOrdenComponent];

@NgModule({
  imports: [
    SharedModule,
    TecnicoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class TecnicoModule { }
