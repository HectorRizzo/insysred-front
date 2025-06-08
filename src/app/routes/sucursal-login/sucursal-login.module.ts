import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SucursalLoginRoutingModule } from './sucursal-login-routing.module';
import { SucursalLoginSucursalLoginComponent } from './sucursal-login/sucursal-login.component';

const COMPONENTS: any[] = [SucursalLoginSucursalLoginComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    SucursalLoginRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class SucursalLoginModule { }
