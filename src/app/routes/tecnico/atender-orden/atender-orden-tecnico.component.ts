import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdenTrabajoDto } from '../../../dto/OrdenTrabajoDto';
import { TecnicoService } from '../../../services/tecnico.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ClientesClienteAddOrdTrabajoComponent } from 'app/routes/clientes/cliente/add-ord-trabajo/add-ord-trabajo.component';
import { ModalAsignarClienteComponent } from '../ordenes-trabajo/modal-cliente/modal-asignar-cliente.component';
import { TecnicoOrdTrabajoVerOrdenComponent } from '../ordenes-trabajo/ver-orden/ver-orden.component';
import { TecnicoOrdTrabajoAtenderOrdenComponent } from '../ordenes-trabajo/atender-orden/atender-orden.component';
import { timestampToDateTime } from '@shared/utils/helpers';

@Component({
  selector: 'app-atender-orden-tecnico',
  templateUrl: './atender-orden-tecnico.component.html',
  styleUrls: ['./atender-orden-tecnico.component.css'],
})
export class AtenderOrdenTecnicoComponent implements OnInit {

  displayedColumns: string[] = ['numOrden', 'codigoCliente', 'motivo', 'tecnico', 'fechaVisita', 'horaVisita', 'acciones'];
  dataSource = new MatTableDataSource<OrdenTrabajoDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  idEmpleado: string;

  pageEvent: PageEvent | undefined;

  constructor(
    private dialog: MatDialog,
    private servicio: TecnicoService,
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.idEmpleado = localStorage.getItem('id_empleado_insysred')??'';
    this.pageSize = 5;
    this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
  }

  cargarOrdenTrabajo(pagina: number, tamanio: number, filter:string=''): void {
    this.servicio.obtenerOrdenesTrabajoTecnico(pagina, tamanio, filter, Number(this.idEmpleado))
      .subscribe((data: any) => {
        data.content.forEach((element: any) => {
          element.fechaVisita = timestampToDateTime(element.fechaVisita);
        });
        this.length = data.totalElements;
          this.dataSource = data.content.sort((a: any, b: any) => a.id - b.id);
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        },
      );
  }

  agregarOrden() {
    const modalAddContrato = this.dialog.open(ModalAsignarClienteComponent, {
      width: '80%',
      disableClose: true
    });
    modalAddContrato.afterClosed()
      .subscribe(() => {
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cargarOrdenTrabajo(this.pageIndex, this.pageSize, filterValue);
  }

  onPageChange(e: any) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.cargarOrdenTrabajo(e.pageIndex, e.pageSize);
  }

  verOrden(ordenTrab: OrdenTrabajoDto) {
    const viewDialog = this.dialog.open(TecnicoOrdTrabajoVerOrdenComponent, {
      width: '40%',
      disableClose: true,
    });
    viewDialog.componentInstance.ordenTrab = ordenTrab;
    viewDialog.componentInstance.watchMode = true;
  }

  editOrden(ordenTrab: OrdenTrabajoDto) {
    alert(ordenTrab.motivo.motivo);
  }

  ejecutarOrden(ordenTrab: OrdenTrabajoDto) {
    const atenderDialog = this.dialog.open(TecnicoOrdTrabajoAtenderOrdenComponent, {
      width: '60%',
      disableClose: true,
    });
    atenderDialog.componentInstance.ordenTrab = ordenTrab;
    atenderDialog.afterClosed()
      .subscribe(() => {
        this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
      });
  }

}
