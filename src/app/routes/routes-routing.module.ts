import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {environment} from '@env/environment';

import {AdminLayoutComponent} from '../theme/admin-layout/admin-layout.component';
import {AuthLayoutComponent} from '../theme/auth-layout/auth-layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './sessions/login/login.component';
import {RegisterComponent} from './sessions/register/register.component';
import {Error403Component} from './sessions/403.component';
import {Error404Component} from './sessions/404.component';
import {Error500Component} from './sessions/500.component';
import {authGuard} from '@core';
import { EscogerSucursalComponent } from './sessions/escoger-sucursal/escoger-sucursal.component';
import { InicioComponent } from '@shared/components/inicio/inicio.component';
import { NoAuthorizatedComponent } from './sessions/no-authorizated.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      { path: 'unauthorized', component: NoAuthorizatedComponent },
      { path: 'comercial', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),canActivate: [authGuard], canActivateChild: [authGuard]},
      { path: 'procesos', loadChildren: () => import('./procesos/procesos.module').then(m => m.ProcesosModule) ,canActivate: [authGuard], canActivateChild: [authGuard]},
      { path: 'sucursalLogin', loadChildren: () => import('./sucursal-login/sucursal-login.module').then(m => m.SucursalLoginModule) ,canActivate: [authGuard], canActivateChild: [authGuard]},
      { path: 'empresa', loadChildren: () => import('./empresa/empresa.module').then(m => m.EmpresaModule) ,canActivate: [authGuard], canActivateChild: [authGuard]},
      { path: 'seguridad', loadChildren: () => import('./seguridad/seguridad.module').then(m => m.SeguridadModule), canActivate: [authGuard], canActivateChild: [authGuard]},
  { path: 'tecnico', loadChildren: () => import('./tecnico/tecnico.module').then(m => m.TecnicoModule), canActivate: [authGuard], canActivateChild: [authGuard]},
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'escoger_sucursales', component: EscogerSucursalComponent},
    ],
  },
  {path: '**', redirectTo: 'inicio'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {
}
