import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from 'app/services/clients.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { EmpleadosService } from 'app/services/empleados.service';
import { CargoDTO } from 'app/dto/CargoDTO';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-asignar-jefe',
  templateUrl: './asignar-jefe.component.html',
  styleUrls: ['./asignar-jefe.component.css']
})
export class AsignarJefeComponent implements OnInit {

  empleadosColumns: string[] = ['seleccionar','identificacion', 'nombreCompleto','telefonoMovil','telefonoFijo', 'correo'];
  dataEmpleados = new MatTableDataSource<EmpleadosDTO>();
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  filter = '';
  idJefe: number | undefined;
  selectedJefe: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  @Input() jefeId: any;
  @Input() empleadoId: any;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private clientService: ClientsService,
    private toast: ToastService,
    private empleadoService: EmpleadosService
  ) {

  }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
    this.obtenerEmpleados();
  }

  guardarAsignacion() {
    const asignarJefe = {
      idEmpleado: this.empleadoId,
      idJefe: this.idJefe
    };
    this.empleadoService.asignarJefe(asignarJefe).subscribe({
      next: (res) => {
        this.toast.showMessage('Jefe asignado correctamente', MessageType.SUCCESS);
        this.closeDialog();
      },
      error: (error) => {
        this.toast.showMessage('Error al asignar el jefe ' + error, MessageType.ERROR);
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }


  seleccionarElemento(jefe: EmpleadosDTO) {
    this.idJefe = jefe.id;
  }

  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados( this.pageIndex, this.pageSize, this.filter).subscribe({
      next: (res) => {
        const data = res.data;
        const empleados = data.content.filter(
          (empleado: EmpleadosDTO) => empleado.id !== this.empleadoId);
        this.dataEmpleados = new MatTableDataSource(empleados);
        this.length = data.totalElements;
        console.log('this.jefeId', this.jefeId);
        this.selectedJefe = this.dataEmpleados.data.find((empleado: EmpleadosDTO) => empleado.id === this.jefeId)?.id;
        console.log('this.selectedJefe', this.selectedJefe);
      },
      error: (error) => {
        this.toast.showMessage('Error al obtener los empleados ' + error, MessageType.ERROR);
      }
    });
  }


  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.obtenerEmpleados();
  }



}
