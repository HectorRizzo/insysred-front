import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {FormBuilder, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UsuarioService } from 'app/services/usuario.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-seguridad-usuario-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class SeguridadUsuarioNuevoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<SeguridadUsuarioNuevoComponent>,
    private usuarioService: UsuarioService,
    private toast : ToastService,
    private dialog: MatDialog,
    private clipboard: Clipboard 

  ) {
  }

  newClientForm = this.fb.nonNullable.group({
    tipoidentificacion: ['', [Validators.required]],
    identificacion: [{value: '', disabled: true}, [Validators.required, this.cedulaEcuatorianaValidator()]],
    sexo: ['', [Validators.required]],
    primerNombre: ['', [Validators.required]],
    segundoNombre: [''],
    primerApellido: ['', [Validators.required]],
    segundoApellido: [''],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['']
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
  

  cedulaEcuatorianaValidator() {
    return (control:any) => {
      if(this.newClientForm.get('tipoidentificacion')?.value !== 'CEDULA'){
        return null;
      }
      const cedulaRegex = /^[0-9]{10}$/; // Expresión regular para el formato de cédula ecuatoriana
      if (control.value && !cedulaRegex.test(control.value)) {
        return { invalidIdentificacion: true };
      }
      
      const prov = control.value.substring(0, 2);
      if (prov < '01' || prov > '30') {
        return { invalidIdentificacion: true };
      }

      // Obtener los primeros 9 dígitos de la cédula
      const digitos = control.value.substring(0, 9);

      const pesos = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let suma = 0;
      for (let i = 0; i < 9; i++) {
        let valor = Number(digitos[i]) * pesos[i];
        if (valor >= 10) {
          valor = valor - 9;
        }
        suma += valor;
      }

      //calcular digito verificador
      let verificador = 10 - (suma % 10);
      if (verificador === 10) {
        verificador = 0;
      }

      //comparar digito verificador con el ultimo digito de la cedula
      if (verificador !== Number(control.value[9])) {
        return { invalidIdentificacion: true };
      }

      return null;

    };
  }
  saveClient(): void {
    console.log(this.newClientForm.value);
    const usuario = {
      tipoIdentificacion: this.newClientForm.value.tipoidentificacion,
      identificacion: this.newClientForm.value.identificacion,
      sexo: this.newClientForm.value.sexo,
      primerNombre: this.newClientForm.value.primerNombre,
      segundoNombre: this.newClientForm.value.segundoNombre,
      primerApellido: this.newClientForm.value.primerApellido,
      segundoApellido: this.newClientForm.value.segundoApellido,
      telefono: this.newClientForm.value.telefono,
      email: this.newClientForm.value.email,
      direccion: this.newClientForm.value.direccion
    };
    
    this.usuarioService.guardarUsuario(usuario).subscribe({
      next: res => {
        console.log('Usuario guardado con éxito', res);
        const data = res.data;
        this.abrirModalInfo(data.username, data.password);

        this.closeDialog();
      },
      error: error => {
        console.error('Error:', error);
        this.toast.showMessage('Error al guardar el usuario', MessageType.ERROR);
      }
    });
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
