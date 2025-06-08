import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { timestampToDateTime } from '@shared/utils/helpers';
import { MarcaEquipoDto } from 'app/dto/MarcaEquipoDto';
import { InventarioEquiposService } from 'app/services/inventarioEquipos';
import { NuevaMarcaEquipoComponent } from './nuevo/nueva-marca-equipo.component';
import { EditarMarcaEquipoComponent } from './editar/editar-marca-equipo.component';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';

@Component({
  selector: 'app-marca-equipos',
  templateUrl: './marca-equipos.component.html',
  styleUrls: ['./marca-equipos.component.css']
})
export class MarcaEquiposComponent implements OnInit {

  displayedColumns: string[] = ['nombreMarca', 'nombreModelo','estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;
  marcaEquipos:MarcaEquipoDto[] = [];
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  constructor(private inventarioEquiposService: InventarioEquiposService,
    private router: Router,
    private toast: ToastService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getData();
    this.getMarcaEquipo();

  }

  openNewForm() {
    const modalNuevo = this.dialog.open(NuevaMarcaEquipoComponent, {
      width: '100%',
    });
    modalNuevo.componentInstance.guardado.subscribe(() => {
      this.getData();
    });
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    // this.filtroCliente = filtro;
    this.getData();
    // this.dataSource.filter = filtro.trim().toLowerCase();
  }
  getData(){

    this.inventarioEquiposService.getMarcaEquipoPage(this.pageIndex, this.pageSize,'')
      .subscribe((res: any) => {
        const content = res.content || res;
        content.forEach((element: any) => {
      });
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

  getMarcaEquipo(){
    this.inventarioEquiposService.getMarcaEquipos().subscribe((res: any) => {
    console.log(res);
    this.marcaEquipos = res;
    console.log(this.marcaEquipos);

    });
  }
  editarEquipo(id: number, equipo: any){
    const modalEditar = this.dialog.open(EditarMarcaEquipoComponent, {
      width: '100%',
    });
    modalEditar.componentInstance.marcaEquipo = equipo;
    modalEditar.componentInstance.guardado.subscribe(() => {
      this.getData();
    });
  }

  updateStatus(event: any, marcaEquipo: any) {
    const checked = event.source.checked;
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto'
    });

    modalWarning.componentInstance.mensaje = '¿Está seguro de cambiar el estado de esta marca-modelo?';

    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';

    modalWarning.componentInstance.respuesta.subscribe(
        (respuesta: boolean) => {
            if (respuesta){
              this.inventarioEquiposService.actualizarMarcaEquipo(marcaEquipo.id,marcaEquipo).subscribe({
                next: res => {
                  this.toast.showMessage('Marca Equipo creado con éxito', MessageType.SUCCESS);
                  this.toast.showMessage('Usuario actualizado con éxito', MessageType.SUCCESS);
                  this.getData();
                },
                error: error => {
                  console.error('Error:', error);
                  this.toast.showMessage('Error al crear Marca Equipo', MessageType.ERROR);
                }
              });
            } else{
              marcaEquipo.activo = !checked;
            }
    });
  }

  clearFilters(){
    // this.filtroFactura.setValue(null);
    // this.filtroMarca.setValue('');
    // this.emitionRange.setValue({start: null, end: null});
    // this.filtroEstado.setValue('');
    // this.getData();
  }
  


}
