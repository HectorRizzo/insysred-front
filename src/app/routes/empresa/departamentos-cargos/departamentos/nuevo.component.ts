import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UsuarioService } from 'app/services/usuario.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { EmpleadosService } from 'app/services/empleados.service';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
@Component({
  selector: 'app-seguridad-usuario-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoDepartamentoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<NuevoDepartamentoComponent>,
    private empleadoService: EmpleadosService,
    private toast: ToastService
  ) {
  }
  @Input() departamento:DepartamentoDTO | null = null;
  @Input() editar = false;

  newForm = this.fb.nonNullable.group({
     nombre: ['', Validators.required],
     descripcion: ['', Validators.required],
      estado: [true, Validators.required]
    });
  translateSubscription!: Subscription;


  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.setearDepartamento();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  setearDepartamento(): void {
    if (this.departamento) {
      console.log(this.departamento);
      this.newForm.get('nombre')?.setValue(this.departamento.nombre? this.departamento.nombre : '');
      this.newForm.get('descripcion')?.setValue(this.departamento.descripcion? this.departamento.descripcion : '');
      this.newForm.get('estado')?.setValue(this.departamento.activo? this.departamento.activo : true);
    }
  }

  save(): void {
    if (this.newForm.invalid) {
      this.toast.showMessage('Por favor complete los campos requeridos', MessageType.WARNING);
      return;
    }
  
    const departamento: DepartamentoDTO = {
      id: this.departamento?.id?? null,
      nombre: this.newForm.get('nombre')?.value?? null, 
      descripcion: this.newForm.get('descripcion')?.value?? null,
      activo: this.newForm.get('estado')?.value?? null
    };

    if(this.editar){
      this.empleadoService.editarDepartamento(departamento, departamento.id).subscribe((res) => {
        this.toast.showMessage('Departamento editado correctamente', MessageType.SUCCESS);
        this.dialogRef.close();
      }, (error) => {
        this.toast.showMessage('Error al editar el departamento', MessageType.ERROR);
      });
    }else{

      this.empleadoService.guardarDepartamento(departamento).subscribe((res) => {
        this.toast.showMessage('Departamento creado correctamente', MessageType.SUCCESS);
        this.dialogRef.close();
      }, (error) => {
        this.toast.showMessage('Error al crear el departamento', MessageType.ERROR);
      });
    }
  }

}
