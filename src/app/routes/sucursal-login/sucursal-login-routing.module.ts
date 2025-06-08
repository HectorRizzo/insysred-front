import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucursalLoginSucursalLoginComponent } from './sucursal-login/sucursal-login.component';

const routes: Routes = [{ path: 'sucursalLogin', component: SucursalLoginSucursalLoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalLoginRoutingModule { }
