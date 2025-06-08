import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { MarcaEquipoDto } from 'app/dto/MarcaEquipoDto';
import { InventarioEquiposService } from 'app/services/inventarioEquipos';

@Component({
    selector: 'app-tecnico-equipos-nuevo',
    templateUrl: './nuevo-equipo.component.html',
    styleUrls: ['./nuevo-equipo.component.css'],
    })

export class EquiposNuevoComponent implements OnInit, AfterViewInit {
    form: FormGroup;

    constructor( private fb: FormBuilder,
        private inventarioEquiposService: InventarioEquiposService,
        private toast: ToastService,
        private route: Router
    ) {
        this.form = this.fb.group({
            formArray: this.fb.array([ this.createForm() ])
          });
    }
    ngAfterViewInit(): void {
        this.getMarcaEquipo();
        this.getEstadosEquipo();
    }

    createForm(factura?:string, fechaCompra?:string) {
        return this.fb.group({
            facturaCompra: [factura
        , [Validators.required]],
        fechaCompra: [new Date(), [Validators.required]],
        macAddress: [''],
        modoOperacion: [''],
        idMarcaEquipo: ['', [Validators.required]],
        estado: ['', [Validators.required]]
        });
    }
    dataMarcaModelo:MarcaEquipoDto[] = [];
    dataEstadosEquipo: any[] = [];


    ngOnInit() {

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

    addForm() {
        const formArray = this.form.get('formArray') as FormArray;
        if(formArray.length < 1){
            formArray.push(this.createForm());
            return;
        }
        formArray.push(this.createForm(
        formArray.at(0).get('facturaCompra')?.value,
        formArray.at(0).get('fechaCompra')?.value
        ));
    }

    get formArray(): AbstractControl[] {
        return (this.form.get('formArray') as FormArray).controls;
      }

    cancelar() {
        this.form.reset();
    }
    removeForm(index: number) {
        const formArray = this.form.get('formArray') as FormArray;
        formArray.removeAt(index);
    }
    guardar() {
        const equipos = this.form.value.formArray;
        console.log(equipos);
        this.inventarioEquiposService.guardarEquipos(equipos).subscribe({ 
            next: (res: any) => {
            console.log(res);
            if(res.status === 200){
                this.toast.showMessage('Equipos guardados', MessageType.SUCCESS);
                this.route.navigate(['/tecnico/equipos']);
            }
        }
        });
    }
    
}