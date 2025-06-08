import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServidoresService } from '../../../../services/servidores.service';
import { FormBuilder } from '@angular/forms';
import { SeguridadService } from '../../../../services/seguridad.service';
import { SucursalDto } from '../../../../dto/SucursalDto';
import { SucursalService } from '../../../../services/sucursal.service';
import { RouterDto } from '../../../../dto/RouterDto';
import { AsignaSucursalDto } from '../../../../dto/AsignaSucursalDto';

@Component({
  selector: 'app-empresa-servidores-asignar',
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.css'],
})
export class EmpresaServidoresAsignarComponent implements OnInit {
  @Input() routerDto: any;
  @Input() watchMode: boolean = false;

  displayedColumns: string[] = ['seleccione', 'nombre', 'establecimiento', 'puntoEmision', 'secuencial'];
  dataSource: SucursalDto[] = [];
  sucursalSeleccionada: SucursalDto;
  routerSelect: RouterDto;

  constructor(
    private servicioSucursal: ServidoresService,
    private editDialog: MatDialogRef<EmpresaServidoresAsignarComponent>,
    private servicio: SucursalService,
  ) {
  }

  ngOnInit() {
    this.cargarSucursales();
  }


  closeDialog(): void {
    this.editDialog.close();
  }

  cargarSucursales() {
    this.servicio.obtenerSucursales().subscribe(
      (datos) => {
        this.dataSource = datos;
        this.dataSource.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  seleccionarElemento(elemento: SucursalDto): void {
    this.sucursalSeleccionada = elemento;
  }

  guardarAsignacion() {
    this.routerSelect = this.routerDto;
    const asignacion: AsignaSucursalDto = {
      idRouter: this.routerSelect.id,
      idSucursal: this.sucursalSeleccionada.id,
    };
    this.servicioSucursal.asignarSucursal(asignacion).subscribe(
      (datos: RouterDto) => {
        this.editDialog.close(true);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }
}
