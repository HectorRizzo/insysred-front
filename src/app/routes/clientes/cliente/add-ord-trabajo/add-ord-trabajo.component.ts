import { Component, Input, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { OrdenTrabajoNewDto } from '../../../../dto/OrdenTrabajoNewDto';
import { MotivoVisitaDto } from '../../../../dto/MotivoVisitaDto';
import { HoraVisitaDto } from '../../../../dto/HoraVisitaDto';
import { UsuarioDto } from '../../../../dto/UsuarioDto';
import { TecnicoService } from '../../../../services/tecnico.service';
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';
import { timestampToDateTime } from '@shared/utils/helpers';

@Component({
  selector: 'app-clientes-cliente-addOrdTrabajo',
  templateUrl: './add-ord-trabajo.component.html',
  styleUrls: ['./add-ord-trabajo.component.css'],
})
export class ClientesClienteAddOrdTrabajoComponent implements OnInit {
  @Input() cliente: any;
  @Input() watchMode: boolean = false;
  @Input() orden: OrdenTrabajoNewDto;

  dataMotivo: MotivoVisitaDto[] = [];
  dataHorario: HoraVisitaDto[] = [];
  dataTecnico: EmpleadosDTO[] = [];
  dataTecnicoOriginal: EmpleadosDTO[] = [];
  idHorario: number = 0;
  idMotivo: number = 0;
  idTecnico: number = 0;
  motivo: MotivoVisitaDto;

  constructor(
    private clienteSucursal: ClienteService,
    public dialogRef: MatDialogRef<ClientesClienteAddOrdTrabajoComponent>,
    private servicio: TecnicoService,
    private toast: ToastService,
    private fb: FormBuilder,
  ) {
  }

  
searchControl = new FormControl();
searchChanged = new Subject<string>();

  newOrdtForm = this.fb.nonNullable.group({
    fechaVisita: ['', [Validators.required]],
    horaVisita: [0,[Validators.required]],
    personaReferencia: ['', [Validators.required]],
    telefonoReferencia: ['', [Validators.required]],
    motivo: ['', [Validators.required]],
    tecnico: ['', [Validators.required]],
    direccionReferencia: ['', [Validators.required]],
    referenciaDireccion: ['', [Validators.required]],
  });
  translateSubscription!: Subscription;

  ngOnInit() {
    this.getHorarioVisita();
    this.getMotivoVisita();
    this.getTecnicos();
    this.searchControl.valueChanges.pipe(
      // Espera 300ms después de cada pulsación de tecla antes de considerar el término de búsqueda
      debounceTime(300),
      // Ignora el nuevo término si es el mismo que el término anterior
      distinctUntilChanged(),
      // Maneja la suscripción
      takeUntil(this.searchChanged)
    ).subscribe(searchTerm => {
      this.dataTecnico = this.dataTecnicoOriginal.filter(dato => 
        `${dato.primerApellido} ${dato.segundoApellido} ${dato.primerNombre} ${dato.segundoNombre}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  setearDatos(){
    console.log(this.orden);
    console.log(this.dataHorario.find((horario: any) => horario.id === this.orden.horaVisita.id));
    this.newOrdtForm.get('fechaVisita')?.setValue(timestampToDateTime(Number(this.orden.fechaVisita)).toISOString().split('T')[0]);
    this.newOrdtForm.get('horaVisita')?.setValue(this.dataHorario.find((horario: any) => horario.id === this.orden.horaVisita.id)?.id?? 0);
    this.newOrdtForm.get('personaReferencia')?.setValue(this.orden.personaContacto);
    this.newOrdtForm.get('telefonoReferencia')?.setValue(this.orden.celularContacto?? '');
    this.newOrdtForm.get('motivo')?.setValue(this.orden.motivo?.id);
    this.newOrdtForm.get('direccionReferencia')?.setValue(this.orden.direccion?? '');
    this.newOrdtForm.get('referenciaDireccion')?.setValue(this.orden.referenciaDireccion?? '');
    if(this.orden.lsTecnicos){
      const tecnicos:any = this.dataTecnico.filter((tecnico: any) => 
        {
          if(this.orden?.lsTecnicos){
            return this.orden?.lsTecnicos.some((tecnicoOrden: any) => tecnicoOrden.id === tecnico.id);
          }
          return false;
        });
        console.log(tecnicos);
        this.newOrdtForm.get('tecnico')?.setValue(tecnicos);
      }
      

  }

  guardarDialog() {
    const  selectedTechnicians = this.newOrdtForm.get('tecnico')?.value;


    console.log(this.orden);
    if(this.watchMode){
      const newOrden: OrdenTrabajoNewDto = {
        sucursal: Number(localStorage.getItem('cod_suc')),
        cliente: this.orden.codigoCliente?.id?? 0,
        contrato: this.orden.contrato.numContrato,
        fechaVisita: this.newOrdtForm.get('fechaVisita')?.value || '',
        horaVisita: this.newOrdtForm.get('horaVisita')?.value || '',
        motivo: Number(this.newOrdtForm.get('motivo')?.value || ''),
        tecnicos: selectedTechnicians,
        personaContacto: this.newOrdtForm.get('personaReferencia')?.value || '',
        telefonoContacto: this.newOrdtForm.get('telefonoReferencia')?.value || '',
        direccionReferencia: this.newOrdtForm.get('direccionReferencia')?.value || '',
        referenciaDireccion: this.newOrdtForm.get('referenciaDireccion')?.value || ''
      };
      this.clienteSucursal.editarOrden(this.orden.id,newOrden).subscribe(
        (datos: any) => {
          this.toast.showMessage('Orden de trabajo actualizada', MessageType.SUCCESS);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error al actualizar datos:', error);
        }
      );
    }else{
      console.log('cliente',this.cliente);
      const newOrden: OrdenTrabajoNewDto = {
        sucursal: Number(localStorage.getItem('cod_suc')),
        cliente: this.cliente.cliente.id,
        contrato: this.cliente.contrato,
        fechaVisita: this.newOrdtForm.get('fechaVisita')?.value || '',
        horaVisita: this.newOrdtForm.get('horaVisita')?.value || '',
        motivo: Number(this.newOrdtForm.get('motivo')?.value || ''),
        tecnicos: selectedTechnicians,
        personaContacto: this.newOrdtForm.get('personaReferencia')?.value || '',
        telefonoContacto: this.newOrdtForm.get('telefonoReferencia')?.value || '',
        direccionReferencia: this.newOrdtForm.get('direccionReferencia')?.value || '',
        referenciaDireccion: this.newOrdtForm.get('referenciaDireccion')?.value || ''
      };
      this.clienteSucursal.guardarOrden(newOrden).subscribe(
        (datos: any) => {
          this.toast.showMessage('Orden de trabajo creada', MessageType.SUCCESS);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        }
      );
    }
  }

  getMotivoVisita() {
    this.clienteSucursal.obtenerMotivoVisita().subscribe(
      (datos) => {
        this.dataMotivo = datos;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  getTecnicos() {
    this.servicio.obtenerTecnicos().subscribe(
      (datos:any) => {
        console.log(datos);
        this.dataTecnico = datos.data;
        this.dataTecnicoOriginal = datos.data;
        if(this.watchMode){
          setTimeout(() => {
          this.setearDatos();
          }, 100);
        }
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  getHorarioVisita() {
    this.clienteSucursal.obtenerHorarioVisita().subscribe(
      (datos) => {
        this.dataHorario = datos.sort((a: any, b: any) => a.id - b.id);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  onSelectionHorario(event: any) {
    this.idHorario = event.value;
  }

  onSelectionMotivo(event: any) {
    this.idMotivo = event.value;
  }

  onSelectionTecnico(event: any) {
    this.idTecnico = event.value;
  }

}
