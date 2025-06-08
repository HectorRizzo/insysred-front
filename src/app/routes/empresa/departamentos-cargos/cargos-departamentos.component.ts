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
import { NuevoEmpleadoComponent } from '../empleados/nuevo-empleado/nuevo.component';
import { NuevoDepartamentoComponent } from './departamentos/nuevo.component';
import { NuevoCargoComponent } from './cargos/nuevo.component';
import { EmpleadosService } from 'app/services/empleados.service';
import { CargoDTO } from 'app/dto/CargoDTO';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-cargos-departamentos',
  templateUrl: './cargos-departamentos.component.html',
  styleUrls: ['./cargos-departamentos.component.css']
})
export class CargosDepartamentosComponent implements OnInit {

  cargosColumns: string[] = ['nombre', 'descripcion', 'departamento', 'acciones'];
  departamentosColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  dataCargos = new MatTableDataSource<CargoDTO>([]);
  dataDepartamentos = new MatTableDataSource<DepartamentoDTO>([]);
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
    this.obtenerDepartamentos();
  }

  mostrarModalContratos(cliente: any){
    const modalContratos = this.dialog.open(ContratosComponent, {
      width: '80%'
    });
    modalContratos.componentInstance.cliente = cliente;
    modalContratos.afterClosed().subscribe(() => {
    }
    );
  }

  editarCargo(cargo: CargoDTO) {
    const dialogRef = this.dialog.open(NuevoCargoComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.cargo = cargo;
    dialogRef.componentInstance.editar = true;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerCargos();
    });
  }

  eliminarCargo(cargo: CargoDTO) {
    const dialogRef = this.dialog.open(ModalWarningComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.mensaje = 'Eliminar cargo';
    dialogRef.componentInstance.mensaje2 = '¿Está seguro que desea eliminar el cargo?';
    dialogRef.componentInstance.labelButtonLeft = 'No';
    dialogRef.componentInstance.labelButtonRight = 'Si';

    dialogRef.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
          if (respuesta) {
            cargo.activo = false;
            this.empleadoService.editarCargo(cargo, cargo.id).subscribe({
              next: (res) => {
                this.toast.showMessage('Cargo eliminado correctamente', MessageType.SUCCESS);
                this.obtenerCargos();
              },
              error: (error) => {
                this.toast.showMessage('Error al eliminar el cargo ' + error, MessageType.ERROR);
              }
            });
          }
        }
    );
  }

  eliminarDepartamento(departamento: DepartamentoDTO) {
    const dialogRef = this.dialog.open(ModalWarningComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.mensaje = 'Eliminar departamento';
    dialogRef.componentInstance.mensaje2 = '¿Está seguro que desea eliminar el departamento?';
    dialogRef.componentInstance.labelButtonLeft = 'No';
    dialogRef.componentInstance.labelButtonRight = 'Si';

    dialogRef.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
          if (respuesta) {
            departamento.activo = false;
            this.empleadoService.editarDepartamento(departamento, departamento.id).subscribe({
              next: (res) => {
                this.toast.showMessage('Departamento eliminado correctamente', MessageType.SUCCESS);
                this.obtenerDepartamentos();
              }
            });
          }
        }
    );
  }

  editarDepartamento(departamento: DepartamentoDTO) {
    const dialogRef = this.dialog.open(NuevoDepartamentoComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.departamento = departamento;
    dialogRef.componentInstance.editar = true;
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerDepartamentos();
    });
  }

  eliminaCliente(identificacion: string) {
   alert(`Eliminar cliente con ID: ${identificacion}`);
  }
  verCliente(identificacion: string) {
   alert(`Ver cliente con ID: ${identificacion}`);
  }

  openNewForm(): void {
    const dialogRef = this.dialog.open(NuevoEmpleadoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
  }

  openDepartamentoForm(): void {
    const dialogRef = this.dialog.open(NuevoDepartamentoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerDepartamentos();
    });
  }

  openCargoForm(): void {
    const dialogRef = this.dialog.open(NuevoCargoComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerCargos();
    });
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
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


  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }



}
