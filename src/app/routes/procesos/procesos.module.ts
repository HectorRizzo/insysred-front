import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { CargarBancoComponent } from './cargar-banco/cargar-banco.component';
import { CargarBancoNuevoComponent } from './cargar-banco/nuevo/cargar-banco-nuevo.component';
import { CargarBancoVerComponent } from './cargar-banco/ver/cargar-banco-ver.component';
import { SharedModule } from '@shared';
import { SeguridadModule } from '../seguridad/seguridad.module';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { InputMaskModule } from '@ngneat/input-mask';
import { ComprobantesClienteComponent } from './comprobantes-cliente/comprobantes-cliente.component';
import { ComprobanteClienteEditarComponent } from './comprobantes-cliente/editar/comprobante-cliente-editar.component';
import { ProcesoFacturaComponent } from './proceso-factura/proceso-factura.component';
import { ProcesoFacturaIndividualComponent } from './proceso-factura/individual/proceso-factura-individual.component';
import { ProcesoFacturaMasivoComponent } from './proceso-factura/masivo/proceso-factura-masivo.component';
import { ProcesoFacturaResumenComponent } from './proceso-factura/resumen/proceso-factura-resumen.component';
import { ConciliacionComponent } from './conciliacion/conciliacion.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProcesosRoutingModule,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    SeguridadModule,
    NgxMatFileInputModule,
  ],
  declarations: [
    CargarBancoComponent,
    CargarBancoNuevoComponent,
    CargarBancoVerComponent,
    ComprobantesClienteComponent,
    ComprobanteClienteEditarComponent,
    ProcesoFacturaComponent,
    ProcesoFacturaIndividualComponent,
    ProcesoFacturaMasivoComponent,
    ProcesoFacturaResumenComponent,
    ConciliacionComponent,
  ],
})
export class ProcesosModule {}
