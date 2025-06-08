import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {InterfacesDto} from "../../../dto/microtik/InterfacesDto";
import {MicrotikService} from "../../../services/microtik.service";

@Component({
  selector: 'app-clientes-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ClientesServicioComponent implements OnInit {
  displayedColumns: string[] = ['mac', 'name', 'isActive', 'acciones'];

  dataSource: InterfacesDto[] = [];

  constructor(
    private dialog: MatDialog, private router: Router,
    private servicio: MicrotikService
  ) {
  }

  ngOnInit() {
    this.cargarInterfaces();
  }

  cargarInterfaces() {
   /* this.servicio.obtenerInterfaces().subscribe(
      (datos) => {
        console.log('Datos cargados:', datos);
        this.dataSource = datos;

        console.log('Datos cargados:', this.dataSource);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );*/
  }
}
