import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdenTrabajoDto } from '../../../dto/OrdenTrabajoDto';
import { TecnicoService } from '../../../services/tecnico.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TecnicoOrdTrabajoVerOrdenComponent } from './ver-orden/ver-orden.component';
import { TecnicoOrdTrabajoAtenderOrdenComponent } from './atender-orden/atender-orden.component';
import { ClientesClienteAddOrdTrabajoComponent } from 'app/routes/clientes/cliente/add-ord-trabajo/add-ord-trabajo.component';
import { ModalAsignarClienteComponent } from './modal-cliente/modal-asignar-cliente.component';
import { ClienteService } from 'app/services/cliente.service';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { timestamp } from 'rxjs';
import { timestampToDateTime } from '@shared/utils/helpers';

@Component({
  selector: 'app-ordenes-trabajo',
  templateUrl: './ordenes-trabajo.component.html',
  styleUrls: ['./ordenes-trabajo.component.css'],
})
export class OrdenesTrabajoComponent implements OnInit {

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

  pageEvent: PageEvent | undefined;


  constructor(
    private dialog: MatDialog,
    private servicio: TecnicoService,
    private clienteService: ClienteService,
    private toast: ToastService
    
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.pageSize = 5;
    this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
  }

  cargarOrdenTrabajo(pagina: number, tamanio: number, filter: any =''): void {
    this.servicio.obtenerOrdenesTrabajo(pagina, tamanio, filter)
      .subscribe((data: any) => {
        this.length = data.totalElements;
        data.content.forEach((element: any) => {
          element.fechaVisita = timestampToDateTime(element.fechaVisita);
      });
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
        this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
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

  inactivarOrden(orden: any) {
    console.log(orden);
    const dialog = this.dialog.open(ModalWarningComponent, {
      width: '40%',
      disableClose: true
    });
    dialog.componentInstance.mensaje = 'Inactivar Orden';
    dialog.componentInstance.mensaje2 = '¿Está seguro de inactivar la orden de trabajo?';
    dialog.componentInstance.labelButtonRight = 'Inactivar';
    dialog.componentInstance.labelButtonLeft = 'Cancelar';
    dialog.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      if (respuesta) {
        this.clienteService.inactivarOrden(orden.id)
        .subscribe(
          (next:any) => {
          this.toast.showMessage('Orden de trabajo inactivada', MessageType.SUCCESS);
          this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
        },
        (error) => {
          console.error('Error al cargar datos:', error);
          this.toast.showMessage('Error al inactivar la orden de trabajo', MessageType.ERROR);
        });
      }});
  }
  

  editarOrden(orden:any) {
    console.log(orden);
      const dialog = this.dialog.open(ClientesClienteAddOrdTrabajoComponent, {
        width: '40%',
        disableClose: true
      });
      dialog.componentInstance.cliente = orden.codigoCliente;
      dialog.componentInstance.watchMode = true;
      dialog.componentInstance.orden = orden;
      dialog.afterClosed().subscribe(() => {
        this.cargarOrdenTrabajo(this.pageIndex, this.pageSize);
      });

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
