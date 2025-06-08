import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from 'app/services/plans.service';
import { SucursalService } from 'app/services/sucursal.service';
import { AsignarSucursalClienteDto } from 'app/dto/AsignarSucursalClienteDto';
import { AsignarSucursalUsuarioDTO } from 'app/dto/AsignarSucursalUsuarioDTO';

@Component({
  selector: 'app-modal-asignar-sucursal',
  templateUrl: './modal-asignar-sucursal.component.html',
  styleUrls: ['./modal-asignar-sucursal.component.scss']
})
export class ModalAsignarSucursalComponent implements OnInit {

  @Input() idUsuario: any;

  dataSucursales: any[] = [];

  editPlanForm!: FormGroup;

  listSucursales: any ={
    name : 'Todas las sucursales',
    completed: false,
    sucursales : []
  };


  constructor(
    public dialogRef: MatDialogRef<ModalAsignarSucursalComponent>,
    private fb: FormBuilder,
    private sucursalService: SucursalService
  ) {
  }

  ngOnInit(): void {
    this.getSucursales();
    this.getSucursalesUsuario();
  }

  

  allChecked: boolean = false;

  updateAllChecked(item: any) {
    item.checked = !item.checked;
    this.allChecked = this.listSucursales.sucursales != null 
    && this.listSucursales.sucursales.every((suc: { checked: any; }) => suc.checked);
  }

  someComplete(): boolean {
    if (this.listSucursales.sucursales == null) {
      return false;
    }
    return this.listSucursales.sucursales.filter(
      (suc: { checked: any; }) => suc.checked).length > 0 && !this.allChecked;
  }

  setAll(completed: boolean) {
    this.allChecked = completed;
    if (this.listSucursales.sucursales == null) {
      return;
    }
    this.listSucursales.sucursales.forEach(
      (suc: { checked: boolean; }) => (suc.checked = completed)
    );
  }

  closeModal(res?: any){
    this.dialogRef.close(res);
  }

  getSucursales(){
    this.sucursalService.obtenerSucursales().subscribe({
      next: res => {
        this.dataSucursales = res;
        this.listSucursales.sucursales = this.dataSucursales.map((suc: { id: any; nombre: any; }) => {
          return {
            id: suc.id,
            nombre: suc.nombre,
            checked: false
          };
        });
        console.log(this.listSucursales);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  guardarSucursalesXUsuario(){
    console.log(this.listSucursales);
    const lsSucursalesId = this.listSucursales.sucursales.map((suc:any) => {
      console.log(suc);
      return {
        id: suc.id,
        checked: suc.checked
      };
    });
      
    console.log(lsSucursalesId);
    const body: AsignarSucursalUsuarioDTO = {
      idUsuario: this.idUsuario,
      sucursales: lsSucursalesId
    };
    this.sucursalService.asignarSucursalUsuario(body).subscribe({
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

  getSucursalesUsuario(){
    this.sucursalService.obtenerSucursalesUsuario(this.idUsuario).subscribe({
      next: res => {
        console.log('Sucursales de usuario:', res);
        this.listSucursales.sucursales.forEach((suc:any) => {
          const sucursal = res.data.find((s:any) => s.id === suc.id);
          if(sucursal){
            suc.checked = sucursal.checked;
          }
        });
        console.log(this.listSucursales);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

}
