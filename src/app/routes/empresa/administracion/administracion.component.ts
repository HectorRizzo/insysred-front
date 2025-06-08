import { Component, OnInit } from '@angular/core';
import {EmpresaDto} from '../../../dto/EmpresaDto';
import {EmpresaService} from '../../../services/empresa.service';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {EmpresaAdministracionEditarComponent} from "./editar/editar.component";

@Component({
  selector: 'app-empresa-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class EmpresaAdministracionComponent implements OnInit {

  dataSource: EmpresaDto[] = [];
  constructor( private dialog: MatDialog, private router: Router,
               private servicio: EmpresaService) { }

  ngOnInit() {
    this.cargarEmpresa();

  }

  cargarEmpresa(){
    this.servicio.obtenerEmpresa().subscribe(
      (datos) => {
        this.dataSource = datos;
        console.log('Datos cargados:', this.dataSource);

      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }
  openEditModal(){
    const dialogRef = this.dialog.open(EmpresaAdministracionEditarComponent, {
      width: '40%', // Ajusta el tamaño según tus necesidades
    });
  }
}
