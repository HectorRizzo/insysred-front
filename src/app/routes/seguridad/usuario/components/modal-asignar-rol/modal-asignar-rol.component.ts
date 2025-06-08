import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from 'app/services/seguridad.service';
import { AsignarRolesUsuarioDTO } from 'app/dto/AsignarRolesUsuarioDTO';
import { SucursalService } from 'app/services/sucursal.service';
import { SucursalDto } from 'app/dto/SucursalDto';

@Component({
  selector: 'app-modal-asignar-rol',
  templateUrl: './modal-asignar-rol.component.html',
  styleUrls: ['./modal-asignar-rol.component.scss']
})
export class ModalAsignarRolComponent implements OnInit {

  @Input() idUsuario: any;

  dataRoles: any[] = [];

  editPlanForm!: FormGroup;

  listRoles: any ={
    name : 'Todos los roles',
    completed: false,
    roles : []
  };
  sucGrupo = new FormGroup({
    sucursal: new FormControl(null, Validators.required)
  });

  sucursales: SucursalDto[] = [];


  constructor(
    public dialogRef: MatDialogRef<ModalAsignarRolComponent>,
    private fb: FormBuilder,
    private seguridadService: SeguridadService,
    private sucursalService: SucursalService
  ) {
  }

  ngOnInit(): void {
    this.getRoles();
    this.getSucursalesUsuario();
  }

  

  allChecked: boolean = false;

  updateAllChecked(item: any) {
    item.checked = !item.checked;
    this.allChecked = this.listRoles.roles != null 
    && this.listRoles.roles.every((rol: { checked: any; }) => rol.checked);
  }

  someComplete(): boolean {
    if (this.listRoles.roles == null) {
      return false;
    }
    return this.listRoles.rol.filter(
      (rol: { checked: any; }) => rol.checked).length > 0 && !this.allChecked;
  }

  setAll(completed: boolean) {
    this.allChecked = completed;
    if (this.listRoles.roles == null) {
      return;
    }
    this.listRoles.roles.forEach(
      (suc: { checked: boolean; }) => (suc.checked = completed)
    );
  }

  closeModal(res?: any){
    this.dialogRef.close(res);
  }

  getRoles(){
    this.seguridadService.obtenerTodosRoles().subscribe({
      next: res => {
        this.dataRoles = res.data;
        this.listRoles.roles = this.dataRoles.map((suc: { id: any; nombre: any; }) => {
          return {
            id: suc.id,
            nombre: suc.nombre,
            checked: false
          };
        });
        console.log(this.listRoles);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  guardarSucursalesXUsuario(){
    console.log(this.listRoles);
    const lsRolesId = this.listRoles.roles.map((suc:any) => {
      console.log(suc);
      return {
        id: suc.id,
        checked: suc.checked
      };
    });
      
    console.log(lsRolesId);
    const sucursalId: number | null = this.sucGrupo.value.sucursal ?? null;
    const body: AsignarRolesUsuarioDTO = {
      idUsuario: this.idUsuario,
      roles: lsRolesId,
      idSucursal: sucursalId
    };
    this.seguridadService.asignarRolUsuario(body).subscribe({
      next: res => {
        console.log('Sucursales asignadas con éxito', res);
        this.closeModal(res);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getRolesUsuario(){
    const sucursalValue = this.sucGrupo.value.sucursal;
    console.log('Sucursal:', sucursalValue);
    this.seguridadService.obtenerRolesUsuario(this.idUsuario, sucursalValue).subscribe({
      next: res => {
        console.log('Sucursales de usuario:', res);
        this.allChecked = false;
        this.listRoles.roles.forEach((rol:any) => {
          const rolUser = res.data.find((r:any) => r.id === rol.id);
          if(rolUser){
            rol.checked = rolUser.checked;
          }else{
            rol.checked = false;
          }
        });
        console.log(this.listRoles);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  getSucursalesUsuario(){
    this.sucursalService.obtenerSucursalesUsuario(this.idUsuario).subscribe({
      next: res => {
        console.log('Sucursales de usuario:', res);
        const sucursales = res.data.filter((s:any) => s.checked);
        this.sucursales =sucursales;
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

}
