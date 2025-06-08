import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { EscogerSucursalComponent } from './sessions/escoger-sucursal/escoger-sucursal.component';
import { NoAuthorizatedComponent } from './sessions/no-authorizated.component';
import { CambiarContrasenaComponent } from './sessions/cambiar-contrasena/cambiar-contrasena.component';

const COMPONENTS: any[] = [
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  Error403Component,
  Error404Component,
  Error500Component,
  NoAuthorizatedComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, EscogerSucursalComponent, CambiarContrasenaComponent],
})
export class RoutesModule {}
