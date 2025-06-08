import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';
import { timestampToDateTime } from '@shared/utils/helpers';
@Component({
  selector: 'app-seguridad-ver-datos',
  templateUrl: './ver-datos.component.html',
  styleUrls: ['./ver-datos.component.css']
})
export class VerDatosComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<VerDatosComponent>,
    private toast : ToastService,
    private dialog: MatDialog,
    private empleadosService: EmpleadosService,

  ) {
  }

  @Input() empleado: EmpleadosDTO | undefined;
  @Input() soloVer = false;
  @Output() empleadoGuardado = new EventEmitter<boolean>();

  newClientForm = this.fb.nonNullable.group({
    tipoidentificacion: [{value: '', disabled: true}, [Validators.required]],
    identificacion: [{value: '', disabled: true}, [Validators.required]],
    sexo: [{value: '', disabled: true}, [Validators.required]],
    primerNombre: [{value: '', disabled: true}, [Validators.required]],
    segundoNombre: [{value: '', disabled: true}],
    primerApellido: [{value: '', disabled: true}, [Validators.required]],
    segundoApellido: [{value: '', disabled: true}],
    telefonoFijo: [{value: '', disabled: true}, [Validators.required]],
    telefonoMovil: [{value: '', disabled: true}, [Validators.required]],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    direccion: [{value: '', disabled: true}],
    fechaNacimiento: [{value: '', disabled: true}, [Validators.required]],
    });
    @ViewChild('myTextarea') myTextarea: ElementRef;
  translateSubscription!: Subscription;

  ngAfterViewInit(): void {
    fromEvent(this.myTextarea.nativeElement, 'input').subscribe(() => {
      this.adjustTextareaHeight('textArea');
    });
  }
  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
      this.setearEmpleado(this.empleado!);
  }

  setearEmpleado(empleado: EmpleadosDTO): void {
    console.log(empleado);
    this.newClientForm.patchValue({
      tipoidentificacion: empleado.tipoIdentificacion,
      identificacion: empleado.numeroIdentificacion,
      sexo: empleado.sexo,
      primerNombre: empleado.primerNombre,
      segundoNombre: empleado.segundoNombre,
      primerApellido: empleado.primerApellido,
      segundoApellido: empleado.segundoApellido,
      telefonoFijo: empleado.telefonoFijo,
      telefonoMovil: empleado.telefonoMovil,
      email: empleado.correo,
      direccion: empleado.direccion,
      fechaNacimiento: new Date(empleado.fechaNacimiento).toISOString().split('T')[0],
    });
    console.log(this.newClientForm);
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  validaTipoDocumento(){
    this.newClientForm.get('identificacion')?.enable();
  }

  adjustTextareaHeight(origen: string): void {
    if(origen === 'textArea'){
    this.myTextarea.nativeElement.style.height = 'auto';
    this.myTextarea.nativeElement.style.height = this.myTextarea.nativeElement.scrollHeight + 'px';
    }
  }
  validarCedula(value: string) {
    if (value.length !== 10) {
      return 'Cédula no válida';
    }

    const cedula = value.split('');
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = Number(cedula.pop());
    let suma = 0;

    for (let i = 0; i < cedula.length; i++) {
      const producto = Number(cedula[i]) * coeficientes[i];
      suma += producto >= 10 ? producto - 9 : producto;
    }

    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const resultado = decenaSuperior - suma;

    return resultado === verificador ? 'Cédula válida' : 'Cédula no válida';
  }
  
  saveClient(): void {
    this.empleadoGuardado.emit(true);
    this.closeDialog();
  }

  abrirModalInfo(usuario: any, password: string): void {
    console.log('Abriendo modal de información');
    const modalInfo = this.dialog.open(ModalInfoComponent, {
      width: '40%'
    });
    modalInfo.componentInstance.titulo = 'Usuario creado';
    modalInfo.componentInstance.mensaje = 'El usuario ha sido creado con éxito';
    modalInfo.componentInstance.mensaje2 = `Usuario: ${usuario} - Contraseña: ${password}`;
    modalInfo.componentInstance.muestraBotonCancelar = false;
    modalInfo.componentInstance.labelButtonRight = 'Copiar';
    modalInfo.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      console.log('Valor:', respuesta);
      if (respuesta) {
        this.copyToClipboard(usuario, password);
      }
    });

  }
  copyToClipboard(usuario: any, password: string) {
    const copied = `Usuario: ${usuario} - Contraseña: ${password}`;
    if (copied) {
      this.toast.showMessage('Contraseña copiada al portapapeles', MessageType.SUCCESS);
      return true;
    } else {
      this.toast.showMessage('Error al copiar al portapapeles', MessageType.ERROR);
      return false;
    }
  }
}
