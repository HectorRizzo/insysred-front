import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SucursalService } from '../../../../services/sucursal.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { SucursalClienteDto } from '../../../../dto/SucursalClienteDto';
import { AsignarSucursalClienteDto } from '../../../../dto/AsignarSucursalClienteDto';
import { EmpleadosService } from 'app/services/empleados.service';
import { DepartamentoDTO } from 'app/dto/DepartamentoDTO';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-asignar-departamento',
  templateUrl: './asignar-departamento.component.html',
  styleUrls: ['./asignar-departamento.component.css'],
})
export class AsignarDepartamentoComponent implements OnInit {
  @Input() empleadoId: any;
  @Input() departamentoId: any;
  @Input() watchMode: boolean = false;
  displayedColumns: string[] = ['seleccione', 'nombre', 'descripcion'];
  dataSource: DepartamentoDTO[] = [];
  idDepartamento: number|null;
  selectedDepartamento: any;
  constructor(
    public dialogRef: MatDialogRef<AsignarDepartamentoComponent>,
    private empleadosService: EmpleadosService,
    private toast: ToastService,
    private fb: FormBuilder,
  ) {
  }

  formulario = this.fb.group({
    departamentoSeleccionado: [''],
  });

  ngOnInit() {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.empleadosService.obtenerDepartamentos().subscribe(
      (datos) => {
        this.dataSource = datos.data;
        this.selectedDepartamento = this.dataSource.find((departamento) => departamento.id === this.departamentoId)?.id;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }


  seleccionarElemento(departamento: DepartamentoDTO) {
    console.log(departamento);
    this.selectedDepartamento = departamento.id;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarAsignacion() {
    const asignarDepartamento = {
      idEmpleado: this.empleadoId,
      idDepartamento: this.selectedDepartamento,

    };
    console.log(asignarDepartamento);
    this.empleadosService.asignarDepartamento(asignarDepartamento).subscribe(
      (datos) => {
        this.toast.showMessage('Asignación de sucursales exitosa', MessageType.SUCCESS);
        this.closeDialog();
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }
}
