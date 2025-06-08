import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from 'app/services/clients.service';
import { ContratosComponent } from './contratos/contratos.component';
import { ClientesClienteAddScucComponent } from './add-scuc/add-scuc.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ClientesClienteAddOrdTrabajoComponent } from './add-ord-trabajo/add-ord-trabajo.component';
import { ModalAsignarClienteComponent } from 'app/routes/tecnico/ordenes-trabajo/modal-cliente/modal-asignar-cliente.component';
import { ModalAddClienteSucursalComponent } from './add-cliente-sucursal/modal-add-cliente-sucursal.component';

export interface UserData {
  id: number;
  identificacion: string;
  nombres: string;
  email: string;
  estado: boolean;
}

@Component({
  selector: 'app-clientes-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClientesClienteComponent implements OnInit {

  displayedColumns: string[] = ['identificacion', 'nombres', 'email','celular', 'ip', 'plan', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<UserData>([]);

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
    private toast: ToastService
  ) {

  }

  ngOnInit(): void {
    this.getData();
  }

  mostrarModalContratos(cliente: any){
    const modalContratos = this.dialog.open(ContratosComponent, {
      width: '80%'
    });
    modalContratos.componentInstance.cliente = cliente;
    modalContratos.afterClosed().subscribe(() => {
      this.getData();
    }
    );
  }

  addSucursal(cliente:any){
    const modalAddSucurusal = this.dialog.open(ClientesClienteAddScucComponent, {
      width: '40%',
      disableClose: true
    });
    modalAddSucurusal.componentInstance.clienteDto = cliente;
    modalAddSucurusal.afterClosed()
      .subscribe((value)=>{
        if(value){
          this.getData();
          this.toast.showMessage('Asignación exitosa', MessageType.SUCCESS);
        }
      });
  }

  agregarClienteSucursal() {
    const modalAddClienteSuc = this.dialog.open(ModalAddClienteSucursalComponent, {
      width: '80%',
      disableClose: true
    });
    modalAddClienteSuc.afterClosed()
      .subscribe(() => {
        this.getData();
      });
  }


  editarCliente(identificacion: string , cliente: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        cliente
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/comercial/clientes/editar-cliente/', identificacion] , navigationExtras);
  }

  eliminaCliente(identificacion: string) {
   alert(`Eliminar cliente con ID: ${identificacion}`);
  }
  verCliente(identificacion: string) {
   alert(`Ver cliente con ID: ${identificacion}`);
  }

  openNewForm(): void {
    console.log('nuevo cliente');
    this.router.navigate(['/comercial/clientes/nuevo-cliente']);

  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filter = filtro;
    this.getData();
    // this.dataSource.filter = filtro.trim().toLowerCase();
  }

  getData(){
    const idSucursal = localStorage.getItem('cod_suc');
    this.clientService.getClients(this.pageIndex, this.pageSize, this.filter, idSucursal)
      .subscribe((res: any) => {
        const content = res.content || res;
        this.dataSource = new MatTableDataSource(content);
        this.length = res.totalElements;
      });
  }


  handlePageEvent(e: PageEvent){

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  addOrdTrabajo(cliente:any){
    const modalAddContrato = this.dialog.open(ClientesClienteAddOrdTrabajoComponent, {
      width: '40%',
      disableClose: true
    });
    modalAddContrato.componentInstance.cliente = cliente;
    modalAddContrato.afterClosed()
      .subscribe(() => {
        this.getData();
      });
  }

}
