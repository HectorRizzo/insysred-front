import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from 'app/services/clients.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ContratosComponent } from 'app/routes/clientes/cliente/contratos/contratos.component';
import { ClientesClienteAddScucComponent } from 'app/routes/clientes/cliente/add-scuc/add-scuc.component';
import { ClientesClienteAddOrdTrabajoComponent } from 'app/routes/clientes/cliente/add-ord-trabajo/add-ord-trabajo.component';
import { NuevoEmpleadoComponent } from './nuevo-empleado/nuevo.component';
import { EmpleadosService } from 'app/services/empleados.service';
import { CargoDTO } from 'app/dto/CargoDTO';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { NuevoCargoComponent } from '../departamentos-cargos/cargos/nuevo.component';
import { NuevoDepartamentoComponent } from '../departamentos-cargos/departamentos/nuevo.component';
import { EmpleadosDTO } from 'app/dto/EmpleadosDTO';
import { AsignarDepartamentoComponent } from './asignar-departamento/asignar-departamento.component';
import { AsignarCargoComponent } from './asignar-cargo/asignar-cargo.component';
import { AsignarJefeComponent } from './asignar-jefe/asignar-jefe.component';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleadosColumns: string[] = ['identificacion', 'nombreCompleto','telefonoMovil','telefonoFijo', 'correo', 'acciones'];
  cargosColumns: string[] = ['nombre', 'descripcion', 'departamento', 'acciones'];
  departamentosColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  dataCargos = new MatTableDataSource<CargoDTO>([]);
  dataDepartamentos = new MatTableDataSource<DepartamentoDTO>([]);
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private clientService: ClientsService,
    private toast: ToastService,
    private empleadoService: EmpleadosService
  ) {

  }

  ngOnInit(): void {
    this.obtenerCargos();
    this.obtenerEmpleados();
  }

  editarEmpleado(empleado: EmpleadosDTO) {
    const dialogRef = this.dialog.open(NuevoEmpleadoComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.empleado = empleado;
    dialogRef.componentInstance.editar = true;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerEmpleados();
    });
  }

  asignarDepartamento(empleado: EmpleadosDTO) {
    const dialogRef = this.dialog.open(AsignarDepartamentoComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.empleadoId = empleado.id;
    dialogRef.componentInstance.departamentoId = empleado.idDepartamento;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerEmpleados();
    });
  }

  asignarCargo(empleado: EmpleadosDTO) {
    if(empleado.idDepartamento === null){
      this.toast.showMessage('El empleado no tiene asignado un departamento', MessageType.ERROR);
      return;
    }
    const dialogRef = this.dialog.open(AsignarCargoComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.empleadoId = empleado.id;
    dialogRef.componentInstance.departamentoId = empleado.idDepartamento;
    dialogRef.componentInstance.cargoId = empleado.idCargo;
    dialogRef.componentInstance.watchMode = true;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerEmpleados();
    });
  }

  asignarJefe(empleado: EmpleadosDTO) {
    const dialogRef = this.dialog.open(AsignarJefeComponent, {
      width: '80%'
    });
    dialogRef.componentInstance.empleadoId = empleado.id;
    dialogRef.componentInstance.jefeId = empleado.idJefe;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerEmpleados();
    });
  }



  inactivarEmpleado(empleado: EmpleadosDTO) {
    const dialogRef = this.dialog.open(ModalWarningComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.mensaje = 'Inactivar empleado';
    dialogRef.componentInstance.mensaje2 = '¿Está seguro que desea inactivar el empleado?';
    dialogRef.componentInstance.labelButtonRight = 'Aceptar';
    dialogRef.componentInstance.labelButtonLeft = 'Cancelar';
    dialogRef.componentInstance.respuesta.subscribe((result) => {
      if (result) {
        this.empleadoService.inactivarEmpleado(empleado.id).subscribe({
          next: (res) => {
            this.toast.showMessage('Empleado inactivado correctamente', MessageType.SUCCESS);
            this.obtenerEmpleados();
          },
          error: (error) => {
            this.toast.showMessage('Error al inactivar el empleado ' + error, MessageType.ERROR);
          }
        });
      }
    });
  }


  openNewForm(): void {
    const dialogRef = this.dialog.open(NuevoEmpleadoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerEmpleados();
    });
  }

  openDepartamentoForm(): void {
    const dialogRef = this.dialog.open(NuevoDepartamentoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
  }



  openCargoForm(): void {
    const dialogRef = this.dialog.open(NuevoCargoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
    this.obtenerEmpleados();
  }


  obtenerCargos(){
    this.empleadoService.obtenerCargos().subscribe({
      next: (res) => {
        this.dataCargos = new MatTableDataSource(res.data);
        // this.dataCargos.paginator = this.paginator;
        // this.dataCargos.sort = this.sort;
      },
      error: (error) => {
        this.toast.showMessage('Error al obtener los cargos ' + error, MessageType.ERROR);
      }
    });
  }

  obtenerDepartamentos(){
    this.empleadoService.obtenerDepartamentos().subscribe(
      {
        next: (res) => {
          this.dataDepartamentos = new MatTableDataSource(res.data);
          // this.dataDepartamentos.paginator = this.paginator;
          // this.dataDepartamentos.sort = this.sort;
        },
        error: (error) => {
          this.toast.showMessage('Error al obtener los departamentos ' + error, MessageType.ERROR);
        }
      }
    );	
  }

  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados( this.pageIndex, this.pageSize, this.filter).subscribe({
      next: (res) => {
        const data = res.data;
        this.dataEmpleados = new MatTableDataSource(data.content);
        this.length = data.totalElements;
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
