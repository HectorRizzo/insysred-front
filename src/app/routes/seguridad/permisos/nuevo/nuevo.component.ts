import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import { SeguridadService } from 'app/services/seguridad.service';
import { Router } from '@angular/router';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-seguridad-permisos-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class SeguridadPermisosNuevoComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private seguridadService: SeguridadService,
    private router: Router,
    private toast : ToastService,
  ) {
  }
  dataRoles: any[] = [];
  dataModulos: any[] = [];
  modulosChecked: any[] = [];

  newPermisotForm = this.fb.nonNullable.group({
    rol: ['', [Validators.required]],
  });

  translateSubscription!: Subscription;

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.getRoles();
    this.obtenerModulos();
  }


  getRoles(){
    this.seguridadService.obtenerTodosRoles().subscribe({
      next: res => {
        this.dataRoles = res.data;
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  obtenerModulos(){
    this.seguridadService.obtenerModulos().subscribe({
      next: res => {
        console.log(res);
        const data = res.data;
        this.formatModulos(data);
        this.dataModulos = data;
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  formatModulos(data: any){
    data.forEach((element: any) => {
      element.checked = false;
      if(element.children.size > 0){
        this.formatModulos(element.children);
      }
    });
  }

  checkModulo(modulo: any){
    console.log(modulo);
    modulo.checked = !modulo.checked;
    if(modulo.children && modulo.children.length > 0){
      this.checkChildren(modulo.children, modulo.checked);
    }
  }

  checkChildren(children: any, checked: boolean){
    children.forEach((element: any) => {
      element.checked = checked;
      if(element.children && element.children.length > 0){
        this.checkChildren(element.children, checked);
      }
    });
  }
  guardarPermisos(){
    if(this.newPermisotForm.value.rol === ''){
      this.toast.showMessage('Debe seleccionar un rol',MessageType.ERROR);
      return;
    }
    this.buscarTodosModulosChecked(this.dataModulos);
    const body = {
      idRol: this.newPermisotForm.value.rol,
      modulos: this.modulosChecked
    };
    console.log(body);
    this.seguridadService.guardarPermiso(body).subscribe({
      next: res => {
        console.log('Permisos guardados con éxito', res);
        this.toast.showMessage('Permisos guardados con éxito', MessageType.SUCCESS);
        this.router.navigate(['/seguridad/permisos']);
      },
      error: error => {
        console.error('Error:', error);
        this.toast.showMessage('Error al guardar los permisos', MessageType.ERROR);
      },
    });
  }

  cancelar(){
    this.router.navigate(['/seguridad/permisos']);
  }

  buscarTodosModulosChecked(modulos: any){
    modulos.forEach((modulo: any) => {
        this.modulosChecked.push({
          idModulo: modulo.id,
          checked: modulo.checked?? false
        });
      if(modulo.children && modulo.children.length > 0){
        this.buscarTodosModulosChecked(modulo.children);
      }
    });
  }

  getPermisosExistenteXRol(idRol: any){
    this.seguridadService.obtenerPermisosExistentesXRol(idRol).subscribe({
      next: res => {
        this.resetearModulos();
        const data = res.data;
        data.forEach((element: any) => {
          console.log(element);
          this.findModuloInNodes(element.idModulo, this.dataModulos, element.activo) as any; // Add type assertion here

        });

      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }
  

  findModuloInNodes(id: any, nodes: any, activo: any){
    nodes.forEach((element: any) => {
      if(element.id === id){
        element.checked = activo?? false;
      } else if(element.children && element.children.length > 0){
        this.findModuloInNodes(id, element.children, activo);
      }
    });
      
  }

  resetearModulos(){
    this.dataModulos.forEach((element: any) => {
      element.checked = false;
      if(element.children && element.children.length > 0){
        this.resetChildren(element.children);
      }
    });
  }

  resetChildren(children: any){
    children.forEach((element: any) => {
      element.checked = false;
      if(element.children && element.children.length > 0){
        this.resetChildren(element.children);
      }
    });
  }

}
