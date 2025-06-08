import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {from, fromEvent, Subscription} from 'rxjs';
import {UbicacionService} from '../../../../services/ubicacion.service';
import {ProvinciasDto} from '../../../../dto/provinciasDto';
import {CantonesDto} from '../../../../dto/CantonDto';
import {ClienteDto} from '../../../../dto/ClienteDto';
import {ClienteService} from '../../../../services/cliente.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalMapComponent } from '@shared/components/modal-map/modal-map.component';
import { ReferenciaDto } from 'app/dto/ReferenciaDto';
@Component({
  selector: 'app-clientes-cliente-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class ClientesClienteNuevoComponent implements OnInit {
  dataSouce: ProvinciasDto[] = [];
  dataParentesco: any[] = [
    { id: 'PADRE', descripcion: 'Padre' },
    { id: 'MADRE', descripcion: 'Madre' },
    { id: 'HERMANO(A)', descripcion: 'Hermano(a)' },
    { id: 'TIO(A)', descripcion: 'Tío(a)' },
    { id: 'ABUELO(A)', descripcion: 'Abuelo(a)' },
    { id: 'PRIMO(A)', descripcion: 'primo(a)' },
    { id: 'CONOCIDO(A)', descripcion: 'Conocido(a)' }
  ];

  dataSouceCanton: CantonesDto[] = [];
  dataSouceCantonReferencia: CantonesDto[] = [];
  dataSouceCliente: ClienteDto[] = [];

  isRuc:boolean= false;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService,
    private servicio: UbicacionService,
    private clienteServicio: ClienteService,
    private toast: ToastService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  newClientForm = this.fb.nonNullable.group({
    tipoidentificacion: ['', [Validators.required]],
    identificacion: [{value: '', disabled: true}, [Validators.required, this.cedulaEcuatorianaValidator()]],
    sexo: [null],
    apellidos: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    fNace: [''],
    razonSocial: [''],
    representanteLegal:[''],
    ident_representante:[''],
    telfFijo: [''],
    telfCelular: [''],
    email: ['', [Validators.required, Validators.email]],
    tipoUbucacion: ['']
  });

  newUbicacionForm = this.fb.nonNullable.group({
    tipoUbicacion: [''],
    direccion: [''],
    georeferencia: [''],
    provincia: [''],
    canton: [{value: '', disabled: true}],
    referencia: [''],
  });

  referenceForm = this.fb.nonNullable.group({
    parentesco: [''],
    apellidos : [''],
    nombres : [''],
    telfFijo : [''],
    telfMovil : [''],
    direccion : [''],
    ref_provincia : [''],
    ref_canton : [''],
  });



  translateSubscription!: Subscription;
  @ViewChild('myTextarea') myTextarea: ElementRef;
  @ViewChild('myTextareaRef') myTextareaRef: ElementRef;
  @ViewChild('myTextUbiRef') myTextUbiRef: ElementRef;



  ngAfterViewInit(): void {
    fromEvent(this.myTextarea.nativeElement, 'input').subscribe(() => {
      this.adjustTextareaHeight('textArea');
    });
    fromEvent(this.myTextareaRef.nativeElement, 'input').subscribe(() => {
      this.adjustTextareaHeight('textAreaRef');
    });
    fromEvent(this.myTextUbiRef.nativeElement, 'input').subscribe(() => {
      this.adjustTextareaHeight('textAreaUbiRef');
    });
  }
  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
    this.cargarProvincias();
  }
  adjustTextareaHeight(origen: string): void {
    if(origen === 'textArea'){
    this.myTextarea.nativeElement.style.height = 'auto';
    this.myTextarea.nativeElement.style.height = this.myTextarea.nativeElement.scrollHeight + 'px';
    }else if(origen === 'textAreaRef'){
      this.myTextareaRef.nativeElement.style.height = 'auto';
      this.myTextareaRef.nativeElement.style.height = this.myTextareaRef.nativeElement.scrollHeight + 'px';
    }else if(origen === 'textAreaUbiRef'){
      this.myTextUbiRef.nativeElement.style.height = 'auto';
      this.myTextUbiRef.nativeElement.style.height = this.myTextUbiRef.nativeElement.scrollHeight + 'px';
    }
  }

  cargarProvincias() {
    this.servicio.obtenerProvincias().subscribe(
      (datos) => {
        this.dataSouce = datos;
        console.log('datos cargados:', this.dataSouce);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
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

  validarIdentificacionCliente(identificacion:string) {
    this.clienteServicio.verificarIdentificacionCliente(identificacion).subscribe(
      (res) => {
        console.log('verificarIdentificacionCliente:', res);
        const datos= res.data;
        if (datos) {
          this.toast.showMessage('Identificación ya registrada, por favor asignarlo a esta sucursal', MessageType.ERROR);
          this.newClientForm.get('identificacion')?.setErrors({ invalidIdentificacion: true });
        }
      },
      (error) => {
        console.error('Error al verificar identificación:', error);
      }
    );
  }
  

  cedulaEcuatorianaValidator() {
    return (control:any) => {
      if(control.value !== null && control.value !== ''){
      this.validarIdentificacionCliente(control.value);
      }

      if(this.newClientForm.get('tipoidentificacion')?.value !== 'CEDULA'){
        if(this.newClientForm.get('tipoidentificacion')?.value === 'RUC'){
          if(control.value.length !== 13){
            return { invalidIdentificacion: true };
          }
          const rucRegex = /^[0-9]{13}$/; // Expresión regular para el formato de ruc ecuatoriano
          if (control.value && !rucRegex.test(control.value)) {
            return { invalidIdentificacion: true };
          }
          return null;
        }
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

  openMap() {
    console.log('openMap');
    const dialogRef = this.dialog.open(ModalMapComponent, {
      width: '1200px',
      height: '750px',
    });

    dialogRef.componentInstance.title = 'Ubicación';
    dialogRef.componentInstance.message = 'Seleccione la ubicación en el mapa';
    dialogRef.componentInstance.latitude = -2.16;
    dialogRef.componentInstance.longitude = -79.83;

    dialogRef.componentInstance.latlong.subscribe((latlong: any) => {
      console.log('latlong', latlong);
      this.newUbicacionForm.get('georeferencia')?.setValue(latlong[0] + ',' + latlong[1]);
    });
  }


  llenarCanton(parent: string) {
    console.log('llenarCanton', this.referenceForm.get('provincia')?.value);
    switch (parent) {
      case 'datosCli':
      this.cargarCanton(this.newUbicacionForm.get('provincia')?.value, 'datosCli');
      break;
      case 'referencia':
      this.cargarCanton(this.referenceForm.get('ref_provincia')?.value, 'referencia');
      break;
    }
  }


  validaTipoDocumento(){
    this.newClientForm.get('identificacion')?.enable();
    switch (this.newClientForm.get('tipoidentificacion')?.value) {

      case 'CEDULA':
      case 'PASAPORTE':
        this.isRuc = false;
        this.newClientForm.controls.sexo.setValidators(Validators.required); 
        this.newClientForm.controls.apellidos.setValidators(Validators.required); 
        this.newClientForm.controls.nombres.setValidators(Validators.required); 

        this.newClientForm.controls.razonSocial.setValidators(null); 
        this.newClientForm.controls.representanteLegal.setValidators(null);
        this.newClientForm.controls.ident_representante.setValidators(null);
        this.newClientForm.controls.razonSocial.setValue(''); 
        this.newClientForm.controls.representanteLegal.setValue(''); 
        this.newClientForm.controls.ident_representante.setValue(''); 

        this.newClientForm.updateValueAndValidity();
        break;
      case 'RUC':
        this.isRuc = true;

        this.newClientForm.controls.razonSocial.setValidators(Validators.required); 
        this.newClientForm.controls.representanteLegal.setValidators(Validators.required); 
        this.newClientForm.controls.ident_representante.setValidators(Validators.required); 
        this.newClientForm.controls.sexo.setValidators(null); 
        this.newClientForm.controls.apellidos.setValidators(null); 
        this.newClientForm.controls.nombres.setValidators(null); 
        this.newClientForm.controls.sexo.setValue(null);
        this.newClientForm.controls.apellidos.setValue(''); 
        this.newClientForm.controls.nombres.setValue(''); 



        this.newClientForm.updateValueAndValidity();
        break;
    }
  }

  guardarCliente() {
    this.newClientForm.markAllAsTouched();
    this.newUbicacionForm.markAllAsTouched();
    this.referenceForm.markAllAsTouched();
    //Validar los datos del formulario requeridos
    if (this.newClientForm.invalid || this.newUbicacionForm.invalid || this.referenceForm.invalid) {
      this.toast.showMessage('Datos del cliente incompletos: Revise los campos marcados en rojo', MessageType.ERROR);
      return;
    }

    const referencia: ReferenciaDto = {
      id: 0,
      nombres: this.referenceForm.get('nombres')?.value,
      apellidos: this.referenceForm.get('apellidos')?.value,
      parentesco: this.referenceForm.get('parentesco')?.value,
      telfFijo: this.referenceForm.get('telfFijo')?.value,
      telfMovil: this.referenceForm.get('telfMovil')?.value,
      direccion: this.referenceForm.get('direccion')?.value,
      provincia: this.dataSouce.find((provincia) => provincia.id.toString() === String(this.referenceForm.get('ref_provincia')?.value)),
      canton: this.dataSouceCantonReferencia.find((canton) => canton.id.toString() === String(this.referenceForm.get('ref_canton')?.value))
    };

    const cliente: ClienteDto = {
      id : 0,
      tipoDocumento: this.newClientForm.get('tipoidentificacion')?.value,
      identificacion: this.newClientForm.get('identificacion')?.value,
      sexo: this.newClientForm.get('sexo')?.value,
      fechaNace: this.newClientForm.get('fNace')?.value,
      apellidos: this.newClientForm.get('apellidos')?.value,
      nombres: this.newClientForm.get('nombres')?.value,
      razonSocial: this.newClientForm.get('razonSocial')?.value,
      email: this.newClientForm.get('email')?.value,
      telfFijo: this.newClientForm.get('telfFijo')?.value,
      telfCelular: this.newClientForm.get('telfCelular')?.value,
      latitud : this.newUbicacionForm.get('georeferencia')?.value.split(',')[0],
      longitud : this.newUbicacionForm.get('georeferencia')?.value.split(',')[1],
      ubicacion: this.newUbicacionForm.get('direccion')?.value,
      referenciaUbicacion: this.newUbicacionForm.get('referencia')?.value,
      referencia,
      provincia: this.dataSouce.find((provincia) => provincia.id.toString() === String(this.newUbicacionForm.get('provincia')?.value)),
      canton: this.dataSouceCanton.find((canton) => canton.id.toString() === String(this.newUbicacionForm.get('canton')?.value))
    };

    const idSucursal = localStorage.getItem('cod_suc');
    this.loading = true;
    this.clienteServicio.guardarCliente(cliente,idSucursal).subscribe(
      (datos) => {
        this.dataSouceCliente = datos;
        this.toast.showMessage('Cliente creado', MessageType.SUCCESS);
        this.router.navigate(['/clientes/cliente']);
      },
      (error) => {
        this.toast.showMessage('No se ha podido crear el cliente', MessageType.ERROR);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  cargarCanton(idProvincia: string | undefined, parent?: string) {
    this.servicio.obtenerCantones(idProvincia).subscribe(
      (datos) => {
        switch (parent) {
          case 'datosCli':
            this.dataSouceCanton = datos;
          this.newUbicacionForm.get('canton')?.enable();
          break;
          case 'referencia':
            this.dataSouceCantonReferencia = datos;
          this.referenceForm.get('ref_canton')?.enable();
          break;
        }
        console.log('cantones cargados:', this.dataSouceCanton);
      },
      (error) => {
        console.error('Error al cargar canton:', error);
      }
    );
  }
}
