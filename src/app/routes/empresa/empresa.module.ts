import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EmpresaRoutingModule } from './empresa-routing.module';
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
import { InputMaskModule } from '@ngneat/input-mask';
import { CambiarContraseniaComponent } from './servidores/cambiar-contrasenia/cambiar-contrasenia.component';
import { EmpresaServidoresConfigurarComponent } from './servidores/configurar/configurar.component';
import { SeguridadModule } from '../seguridad/seguridad.module';
import { EmpresaServidoresConfigurarMangleComponent } from './servidores/configurar/mangle/mangle.component';
import { EmpresaServidoresConfigurarQueueComponent } from './servidores/configurar/queue/queue.component';
import { EmpresaServidoresConfigurarFirewallComponent } from './servidores/configurar/firewall/firewall.component';
import { EmpresaServidoresConfigurarInterfazComponent } from './servidores/configurar/interfaz/interfaz.component';
import { EmpresaServidoresConfigurarArpComponent } from './servidores/configurar/arp/arp.component';
import { CargosDepartamentosComponent } from './departamentos-cargos/cargos-departamentos.component';
import { NuevoDepartamentoComponent } from './departamentos-cargos/departamentos/nuevo.component';
import { NuevoCargoComponent } from './departamentos-cargos/cargos/nuevo.component';
import { NuevoEmpleadoComponent } from './empleados/nuevo-empleado/nuevo.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AsignarDepartamentoComponent } from './empleados/asignar-departamento/asignar-departamento.component';
import { AsignarCargoComponent } from './empleados/asignar-cargo/asignar-cargo.component';
import { AsignarJefeComponent } from './empleados/asignar-jefe/asignar-jefe.component';

const COMPONENTS: any[] = [
  EmpresaAdministracionComponent, 
  EmpresaSucursalComponent, 
  EmpresaUtilComponent, 
  EmpresaSucursalNuevoComponent, 
  EmpresaAdministracionEditarComponent, 
  EmpresaSucursalEditarComponent, 
  EmpresaSucursalVerComponent, 
  EmpresaServidoresComponent, 
  EmpresaServidoresVerComponent, 
  CargosDepartamentosComponent,
  NuevoDepartamentoComponent,
  NuevoCargoComponent,
  EmpresaServidoresNuevoComponent, 
  EmpleadosComponent,
  AsignarDepartamentoComponent,
  AsignarCargoComponent,
  NuevoEmpleadoComponent,
  AsignarJefeComponent,
  EmpresaServidoresEditComponent, 
  EmpresaServidoresAsignarComponent, 
  EmpresaServidoresConfigurarComponent, 
  EmpresaServidoresConfigurarMangleComponent, 
  EmpresaServidoresConfigurarQueueComponent, 
  EmpresaServidoresConfigurarFirewallComponent, 
  EmpresaServidoresConfigurarInterfazComponent];
const COMPONENTS_DYNAMIC: any[] = [ EmpresaServidoresConfigurarArpComponent];

@NgModule({
  imports: [
    SharedModule,
    EmpresaRoutingModule,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    SeguridadModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    CambiarContraseniaComponent
  ]
})
export class EmpresaModule { }
