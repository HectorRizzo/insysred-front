import { Component, OnInit } from '@angular/core';
import {SucursalService} from '../../../services/sucursal.service';
import { SucursalDto } from 'app/dto/SucursalDto';
import { AuthService, MenuService } from '@core';
import { Router } from '@angular/router';
import { SeguridadService } from 'app/services/seguridad.service';
import { RoutePermissionService } from '@core/authentication/routePermissionService';
import { CambiarContrasenaComponent } from '../cambiar-contrasena/cambiar-contrasena.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-escoger-sucursal',
  templateUrl: './escoger-sucursal.component.html',
  styleUrls: ['./escoger-sucursal.component.scss']
})
export class EscogerSucursalComponent implements OnInit {
  dataSouce: SucursalDto[] = [];
  idSucursal: number = 0;
  loading = false;
  constructor(
    private servicio: SucursalService,
    private auth: AuthService,
    private router: Router,
    private securityService: SeguridadService,
    private menuService: MenuService,
    private routePermissionService: RoutePermissionService,
    private dialog : MatDialog

  ) {
  }

  ngOnInit() {
    // if (!this.auth.check()) {
    //   this.router.navigateByUrl('/');
    // } else {
      this.cargarSucursales();
    // }
  }

  cargarSucursales() {
    const valorCookie = localStorage.getItem('cod_suc');
    this.idSucursal = valorCookie ? +valorCookie : 0;
    const idUsuario = localStorage.getItem('id_usuario_insysred');
    this.loading = true;
    this.servicio.obtenerSucursalesXUsuario(idUsuario).subscribe(
      (datos) => {
        this.dataSouce = datos;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  escogerSucursal(idSucursal: number){
    console.log('idSucursal', idSucursal);
    this.idSucursal = idSucursal;
    localStorage.setItem('cod_suc', idSucursal.toString());
  }

  continuar() {
    const idUsuario = localStorage.getItem('id_usuario_insysred');
    this.securityService.obtenerPermisosXUsuario(idUsuario,this.idSucursal).subscribe(
      (res) => {
        console.log('data', res.data);
        this.menuService.addNamespace(res.data, 'menu');
        this.menuService.set(res.data);
        this.routePermissionService.setAllowedRoutes(res.data.map((item:any) => item.route));
        if(localStorage.getItem('es_primer_ingreso') === 'true') {
          const dialogRef = this.dialog.open(CambiarContrasenaComponent, {
            width: '50%',
          });
          dialogRef.componentInstance.idUsuario = localStorage.getItem('id_usuario_insysred');
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.router.navigateByUrl('/auth/escoger_sucursales');
            }
          });
        }
        else
        this.router.navigateByUrl('/');
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }
  cancelar() {
    this.router.navigateByUrl('/auth/login');
  }

  

}
