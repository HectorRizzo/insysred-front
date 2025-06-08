import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesClienteComponent } from './cliente/cliente.component';
import { ClientesServicioComponent } from './servicio/servicio.component';
import { ClientesServicioNuevoComponent } from './servicio/nuevo/nuevo.component';
import { ClientesClienteNuevoComponent } from './cliente/nuevo/nuevo.component';
import { PlanesComponent } from './planes/planes.component';
import { ModalCrearPlanComponent } from './planes/components/modal-crear-plan/modal-crear-plan.component';
import { ModalEditarPlanComponent } from './planes/components/modal-editar-plan/modal-editar-plan.component';
import { ContratosComponent } from './cliente/contratos/contratos.component';
import { ModalCrearContratoComponent } from './cliente/modal-crear-contrato/modal-crear-contrato.component';
import { ModalEditarContratoComponent } from './cliente/modal-editar-contrato/modal-editar-contrato.component';
import { CobrosComponent } from './cobros/cobros.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalEditarCobroComponent } from './cobros/modal-editar-cobro/modal-editar-cobro.component';
import { ModalAnularCobroComponent } from './cobros/modal-anular-cobro/modal-anular-cobro.component';
import { ModalImprimirPagoComponent } from './cobros/modal-imprimir-pago/modal-imprimir-pago.component';
import { ModalImprimirContratoComponent } from './cliente/contratos/modal-imprimir-contrato/modal-imprimir-contrato.component';
import { InputMaskModule } from '@ngneat/input-mask';
import { ModalCambiarEstadoContratoComponent } from './cliente/contratos/modal-cambiar-estado-contrato/modal-cambiar-estado-contrato.component';
import { ModalDescuentoCobroComponent } from './cobros/modal-descuento-cobro/modal-descuento-cobro.component';
import { ClientesClienteAddScucComponent } from './cliente/add-scuc/add-scuc.component';
import { ClientesClienteAddOrdTrabajoComponent } from './cliente/add-ord-trabajo/add-ord-trabajo.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RubrosComponent } from './rubros/rubros.component';
import { ModalCrearRubroComponent } from './rubros/modal-crear-rubro/modal-crear-rubro.component';
import { RubrosPorContratoComponent } from './cliente/rubros-por-contrato/rubros-por-contrato.component';
import { ModalAsociarRubroComponent } from './cliente/rubros-por-contrato/modal-asociar-rubro/modal-asociar-rubro.component';
import { CreditosComponent } from './creditos/creditos.component';
import { ModalVerCreditosComponent } from './creditos/modal-ver-creditos/modal-ver-creditos.component';
import { EditarClienteComponent } from './cliente/editar-cliente/editar-cliente.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ModalAddClienteSucursalComponent } from './cliente/add-cliente-sucursal/modal-add-cliente-sucursal.component';

const COMPONENTS: any[] = [ClientesClienteComponent, ClientesServicioComponent, ClientesServicioNuevoComponent, ClientesClienteNuevoComponent, EditarClienteComponent];
const COMPONENTS_DYNAMIC: any[] = [ClientesClienteAddScucComponent, ClientesClienteAddOrdTrabajoComponent];

@NgModule({
  imports: [
    SharedModule,
    ClientesRoutingModule,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    PdfViewerModule,
    NgxMatSelectSearchModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    PlanesComponent,
    ModalCrearPlanComponent,
    ModalEditarPlanComponent,
    ContratosComponent,
    ModalCrearContratoComponent,
    ModalEditarContratoComponent,
    CobrosComponent,
    ModalEditarCobroComponent,
    ModalAnularCobroComponent,
    ModalImprimirPagoComponent,
    ModalImprimirContratoComponent,
    ModalCambiarEstadoContratoComponent,
    ModalDescuentoCobroComponent,
    RubrosComponent,
    ModalAddClienteSucursalComponent,
    ModalCrearRubroComponent,
    RubrosPorContratoComponent,
    ModalAsociarRubroComponent,
    CreditosComponent,
    ModalVerCreditosComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesModule { }
