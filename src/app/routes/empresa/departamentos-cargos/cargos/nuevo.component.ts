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
import { CargoDTO } from 'app/dto/CargoDTO';
@Component({
  selector: 'app-seguridad-usuario-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoCargoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<NuevoCargoComponent>,
    private empleadoService: EmpleadosService,
    private toast: ToastService
  ) {
  }

  @Input() cargo:CargoDTO | null = null;
  @Input() editar = false;

  departamentos: DepartamentoDTO[] = [];

  newForm = this.fb.group({
     nombre: ['', Validators.required],
     descripcion: ['', Validators.required],
      estado: [true, Validators.required],
      departamento: [0,Validators.required]
    });

  translateSubscription!: Subscription;


  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.obtenerDepartamentos();
    this.setearCargo();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  setearCargo(): void {
    if (this.cargo) {
      console.log(this.cargo);
      this.newForm.get('nombre')?.setValue(this.cargo.nombre? this.cargo.nombre : '');
      this.newForm.get('descripcion')?.setValue(this.cargo.descripcion ? this.cargo.descripcion : '');
      this.newForm.get('estado')?.setValue(this.cargo.activo ?? true);
      this.newForm.get('departamento')?.setValue(this.cargo.idDepartamento ?? null);
    }
  }

  obtenerDepartamentos(): void {
    this.empleadoService.obtenerDepartamentos().subscribe({
      next: (res) => {
        this.departamentos = res.data;
      },
      error: (error) => {
        this.toast.showMessage('Error al obtener los departamentos ' + error, MessageType.ERROR);
      }
    });
  }

  save(): void {
    if (this.newForm.invalid) {
      this.toast.showMessage('Por favor complete los campos requeridos', MessageType.WARNING);
      return;
    }
    if(this.newForm.get('departamento')?.value == 0){
      this.toast.showMessage('Por favor seleccione un departamento', MessageType.WARNING);
      return;
    }

    const cargo : CargoDTO = {
      id: this.cargo?.id?? null,
      nombre: this.newForm.get('nombre')?.value?? null, 
      descripcion: this.newForm.get('descripcion')?.value?? null,
      activo: this.newForm.get('estado')?.value?? null,
      idDepartamento: this.newForm.get('departamento')?.value?? null
    };

    if (this.editar) {
      this.empleadoService.editarCargo(cargo, cargo.id).subscribe((res) => {
        this.toast.showMessage('Departamento creado correctamente', MessageType.SUCCESS);
        this.dialogRef.close();
      }, (error) => {
        this.toast.showMessage('Error al crear el departamento', MessageType.ERROR);
      });
    } else {
      this.empleadoService.guardarCargo(cargo).subscribe((res) => {
        this.toast.showMessage('Departamento creado correctamente', MessageType.SUCCESS);
        this.dialogRef.close();
      }, (error) => {
        this.toast.showMessage('Error al crear el departamento', MessageType.ERROR);
      });
    }
  }

}
