import {Component, OnInit, ViewChild} from '@angular/core';
import {SeguridadRolesNuevoComponent} from "./nuevo/nuevo.component";
import {MatDialog} from "@angular/material/dialog";
import {SeguridadService} from "../../../services/seguridad.service";
import {RolDto} from "../../../dto/RolDto";
import {SeguridadRolesEditarComponent} from "./editar/editar.component";
import {MatTableDataSource} from "@angular/material/table";
import {SeguridadRolesVerComponent} from "./ver/ver.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-seguridad-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class SeguridadRolesComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'descripcion', 'isActive', 'acciones'];
  dataSource = new MatTableDataSource<RolDto>([]);


  page = 0;
  size = 5;
  totalPages: number;
  pageSize: number;

  pageEvent: PageEvent | undefined;

  constructor(
    private dialog: MatDialog,
    private servicio: SeguridadService
  ) {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.pageSize = 5;
    this.cargarRoles(this.page, this.size);
  }

  cargarRoles(pagina:number, tamanio:number) {
    this.servicio.obtenerRol(pagina, tamanio)
      .subscribe((data: any) => {
          console.log(data);
          this.totalPages = data.totalPages;
          this.paginator.pageSize = this.pageSize;
          this.paginator.length = data.totalElements;
          this.dataSource = data.content;
        },
        (error) => {
          console.error('Error al cargar datos:', error);
        }
      );
  }

  openFormModal(): void {
    const dialogRef = this.dialog.open(SeguridadRolesNuevoComponent, {
      width: '40%'
    });
    dialogRef.afterClosed()
      .subscribe(() => {
        this.cargarRoles(this.page, this.size);
      });
  }

  editarRol(rol: RolDto) {
    const editDialog = this.dialog.open(SeguridadRolesEditarComponent, {
      width: '40%',
      disableClose: true
    });
    editDialog.componentInstance.rol = rol;
    editDialog.afterClosed()
      .subscribe(() => {
        this.cargarRoles(this.page, this.size);
      });
  }

  verRol(rol: RolDto) {
    const viewDialog = this.dialog.open(SeguridadRolesVerComponent, {
      width: '40%',
      disableClose: true
    });
    viewDialog.componentInstance.rol = rol;
    viewDialog.componentInstance.watchMode = true;
  }

  updateStatus(element: RolDto, event: any) {
    const rolEdit: RolDto = {
      id: element.id,
      nombre: element.nombre,
      isActive: event.checked,
      descripcion: element.descripcion
    };
    this.servicio.actualizarRol(element.id, rolEdit).subscribe(
      (datos: RolDto) => {
        this.cargarRoles(this.page, this.size);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event:any) {
    this.cargarRoles(event.pageIndex, event.pageSize);
  }
}
