import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastService } from '@core/bootstrap/toast.service';
import { timestampToDateTime } from '@shared/utils/helpers';
import { MarcaEquipoDto } from 'app/dto/MarcaEquipoDto';
import { InventarioEquiposService } from 'app/services/inventarioEquipos';
import { EquiposEditarComponent } from './editar/editar-equipo.component';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {

  displayedColumns: string[] = ['factura', 'fechaCompra', 'ip', 'macAddress', 'marcaEquipo', 'modoOperacion', 'estado', 'acciones'];
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

  filtroFactura = new FormControl<number|null>(null);
  filtroMarca = new FormControl<string>('');
  emitionRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  filtroEstado = new FormControl<string>('');
  filtroActivo = new FormControl<string>('');
  tiposEstado = [
    { id: '', nombre: 'TODOS' }
  ];

  tiposActivo = [
    { id: '', descripcion: 'TODOS' },
    { id: 'ACTIVO', descripcion: 'ACTIVO' },
    { id: 'INACTIVO', descripcion: 'INACTIVO' },
  ];
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
    this.getTiposEstado();

  }

  openNewForm() {
    console.log('nuevo equipo');
    this.router.navigate(['/tecnico/equipos/nuevo-equipo']);
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    // this.filtroCliente = filtro;
    this.getData();
    // this.dataSource.filter = filtro.trim().toLowerCase();
  }
  getData(){

    const filtros = {
      factura: this.filtroFactura.value != null && this.filtroFactura.value > 0 ? this.filtroFactura.value : null,
      marca: this.filtroMarca.value,
      fechaInicio:this.emitionRange.value.start,
      fechaFin: this.emitionRange.value.end,
      estado: this.filtroEstado.value,
      activo : this.filtroActivo.value
    };
    this.inventarioEquiposService.getEquipos(this.pageIndex, this.pageSize,filtros)
      .subscribe((res: any) => {
        const content = res.content || res;
        content.forEach((element: any) => {
          element.fechaCompra = timestampToDateTime(element.fechaCompra).toISOString().split('T')[0];
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
    const modalEditar = this.dialog.open(EquiposEditarComponent, {
      width: '100%',
    });
    modalEditar.componentInstance.id = id;
    modalEditar.componentInstance.facturaCompra = equipo.facturaCompra;
    modalEditar.componentInstance.fechaCompra = equipo.fechaCompra;
    modalEditar.componentInstance.macAddress = equipo.macAddress;
    modalEditar.componentInstance.modoOperacion = equipo.modoOperacion;
    modalEditar.componentInstance.idMarcaEquipo = equipo.idMarcaEquipo;
    modalEditar.componentInstance.estado = equipo.idEstado;
    modalEditar.componentInstance.activo = equipo.activo;

    modalEditar.componentInstance.guardado.subscribe(() => {
      this.getData();
    });
  }

  clearFilters(){
    this.filtroFactura.setValue(null);
    this.filtroMarca.setValue('');
    this.emitionRange.setValue({start: null, end: null});
    this.filtroEstado.setValue('');
    this.getData();
  }

  getTiposEstado(){
    return this.inventarioEquiposService.getEstadosEquipo().subscribe((res: any) => {
      this.tiposEstado = res.data;
      console.log(this.tiposEstado);
    });
  }
  


}
