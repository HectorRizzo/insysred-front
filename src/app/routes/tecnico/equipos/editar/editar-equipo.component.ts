import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { dateTimeToTimestamp } from '@shared/utils/helpers';
import { EquipoDto } from 'app/dto/EquipoDto';
import { MarcaEquipoDto } from 'app/dto/MarcaEquipoDto';
import { InventarioEquiposService } from 'app/services/inventarioEquipos';
import * as moment from 'moment';

@Component({
    selector: 'app-tecnico-equipos-editar',
    templateUrl: './editar-equipo.component.html',
    styleUrls: ['./editar-equipo.component.css'],
    })

export class EquiposEditarComponent implements OnInit {
    @Input() id: number = 0;
    @Input() facturaCompra: string = '';
    @Input() fechaCompra: Date = new Date();
    @Input() macAddress: string = '';
    @Input() modoOperacion: string = '';
    @Input() idMarcaEquipo: string = '';
    @Input() estado: string = '';
    @Input() activo: boolean = true;

    @Output() guardado: EventEmitter<any> = new EventEmitter();

    constructor( private fb: FormBuilder,
        private inventarioEquiposService: InventarioEquiposService,
        private toast: ToastService,
        private route: Router,
        private dialog: MatDialog
    ) {

    }
    ngAfterViewInit(): void {
        this.getMarcaEquipo();
        this.getEstadosEquipo();
    }
    formEquipos = this.fb.group({
    facturaCompra: ['', [Validators.required]],
    fechaCompra: [new Date(), [Validators.required]],
    macAddress: ['', [Validators.required]],
    modoOperacion: ['', [Validators.required]],
    idMarcaEquipo: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    activo: ['']
    });


    dataMarcaModelo:MarcaEquipoDto[] = [];
    dataEstadosEquipo: any[] = [];
    dataEstadoActivo: any[] = [{
        id: 'ACTIVO'
    },{
        id: 'INACTIVO'
    }];
    


    ngOnInit() {
        console.log(this.estado);
        this.formEquipos.get('facturaCompra')?.setValue(this.facturaCompra);
        this.formEquipos.get('fechaCompra')?.setValue(this.fechaCompra);
        this.formEquipos.get('macAddress')?.setValue(this.macAddress);
        this.formEquipos.get('modoOperacion')?.setValue(this.modoOperacion);
        this.formEquipos.get('idMarcaEquipo')?.setValue(this.idMarcaEquipo);
        this.formEquipos.get('estado')?.setValue(this.estado);
        this.formEquipos.get('activo')?.setValue(this.activo? 'ACTIVO' : 'INACTIVO');
    }

    getMarcaEquipo(){
        this.inventarioEquiposService.getMarcaEquipos().subscribe((res: any) => {
        console.log(res);
        this.dataMarcaModelo = res;
        console.log(this.dataMarcaModelo);
        });
    }

    getEstadosEquipo() {
        return this.inventarioEquiposService.getEstadosEquipo().subscribe({
          next: (res: any) => {
            const data = res.data;
            this.dataEstadosEquipo = data;
          },
          error: (error) => {
            console.log(error);
            this.toast.showMessage('Error al cargar los estados de los equipos: '+ error, MessageType.ERROR);
          }
        });
      }



    cancelar() {
        this.dialog.closeAll();
    }

    guardar() {
        console.log(moment(this.formEquipos.get('fechaCompra')?.value).toISOString());
        const equipos:any = {
            facturaCompra: this.formEquipos.get('facturaCompra')?.value,
            fechaCompra:  moment(this.formEquipos.get('fechaCompra')?.value).toISOString(),
            macAddress: this.formEquipos.get('macAddress')?.value,
            modoOperacion: this.formEquipos.get('modoOperacion')?.value,
            idMarcaEquipo: this.formEquipos.get('idMarcaEquipo')?.value,
            idEstado: Number(this.formEquipos.get('estado')?.value),
            activo: this.formEquipos.get('activo')?.value === 'ACTIVO'
        };

        console.log(equipos);
        this.inventarioEquiposService.actualizarEquipo(this.id, equipos).subscribe({ 
            next: (res: any) => {
            console.log(res);
            if(res.status === 200){
                this.toast.showMessage('Equipos guardados', MessageType.SUCCESS);
                this.guardado.emit(true);
                this.dialog.closeAll();
            }
        }
        });
    }

    

    
}