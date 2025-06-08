import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {SucursalDto} from '../../../../dto/SucursalDto';
import {RolDto} from '../../../../dto/RolDto';
import {SucursalService} from '../../../../services/sucursal.service';

@Component({
  selector: 'app-empresa-sucursal-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EmpresaSucursalEditarComponent implements OnInit {
  @Input() editable: boolean = true;
  @Input() sucursal: any;
  @Input() watchMode: boolean = false;
  editSucursalForm!: FormGroup;
  constructor( private fb: FormBuilder,
               private servicio:SucursalService,
               private editDialog: MatDialogRef<EmpresaSucursalEditarComponent>
  ) { }

  dataActivo = [ {value: true, viewValue: 'Activo'}, {value: false, viewValue: 'Inactivo'}];
  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.editSucursalForm = this.fb.group({
      nombreSuc: [this.sucursal.nombre || '', [Validators.required]],
      direccionSuc: [this.sucursal.direccion || ''],
      establecimiento: [this.sucursal.establecimiento, [Validators.required, this.validarDigitosEstablecimiento()] ],
      ptoEmision: [this.sucursal.puntoEmision, [Validators.required, this.validarDigitosEstablecimiento()] ],
      isActive: [this.sucursal.isActive],
      Secuencial: [this.sucursal.secuencial, [Validators.required , this.validarDigitosSecuencial()]],
    });
  }

    guardarSucursal(){
      console.log(this.editSucursalForm);
      if (this.editSucursalForm.invalid) {
        return;
      }
    const sucursalEdit: SucursalDto = {
      direccion: this.editSucursalForm.get('direccionSuc')?.value,
      establecimiento: this.editSucursalForm.get('establecimiento')?.value,
      id: this.editSucursalForm.get('id')?.value,
      isActive: this.editSucursalForm.get('isActive')?.value,
      nombre: this.editSucursalForm.get('nombreSuc')?.value,
      puntoEmision: this.editSucursalForm.get('ptoEmision')?.value,
      secuencial: this.editSucursalForm.get('Secuencial')?.value,
      empresa: {
        id: 1,
        ruc: '',
        nombre: '',
        nombreComercial: '',
        direccion: '',
        isActive: true
      }
    };

      this.servicio.updateSucursal(this.sucursal.id, sucursalEdit).subscribe(
        (datos: SucursalDto) => {
          this.editDialog.close(true);
        },
        (error) => {
          console.error('Error al cargar datos:', error);
          this.editDialog.close();
        }
      );

  }
  closeDialog(): void {
    this.editDialog.close();
  }

  validarDigitosEstablecimiento() {
    return (control: any) => {
      const establecimiento = control.value;
      if (establecimiento.length < 3 || establecimiento.length > 3) {
        return {invalidLength: true};
      }
      return null;
    };
  }

  validarDigitosSecuencial() {
    return (control: any) => {
      const secuencial = control.value;
      if (secuencial.length < 9 || secuencial.length > 9) {
        return {invalidLength: true};
      }
      return null;
    };
  }
}
