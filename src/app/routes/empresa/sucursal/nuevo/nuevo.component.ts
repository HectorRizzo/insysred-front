import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SucursalService} from '../../../../services/sucursal.service';
import {Subscription} from 'rxjs';
import {SucursalDto} from '../../../../dto/SucursalDto';

@Component({
  selector: 'app-empresa-sucursal-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class EmpresaSucursalNuevoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private servicio: SucursalService,
    private dialogRef: MatDialogRef<EmpresaSucursalNuevoComponent>
  ) {
  }

  newSucursalForm = this.fb.nonNullable.group({
    nombreSuc: ['', [Validators.required]],
    direccionSuc: ['', [Validators.required]],
    establecimiento: ['',[Validators.required, this.validarDigitosEstablecimiento()] ],
    ptoEmision: ['', [Validators.required, this.validarDigitosEstablecimiento()]],
    Secuencial: ['', [Validators.required, this.validarDigitosSecuencial()]]
  });

  translateSubscription!: Subscription;

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
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

  guardarDialog() {

    const newSucursal: SucursalDto = {
      id: 0,
      nombre: this.newSucursalForm.get('nombreSuc')?.value || '',
      direccion: this.newSucursalForm.get('direccionSuc')?.value || '',
      establecimiento: this.newSucursalForm.get('establecimiento')?.value || '',
      puntoEmision: this.newSucursalForm.get('ptoEmision')?.value || '',
      secuencial: this.newSucursalForm.get('Secuencial')?.value || '',
      isActive: true,
      empresa: {
        id: 1,
        ruc: '',
        nombre: '',
        nombreComercial: '',
        direccion: '',
        isActive: true
      }
    };

    this.servicio.crearSucursales(newSucursal).subscribe(
      (datos: SucursalDto) => {
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
        this.dialogRef.close();
      },
    );
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
