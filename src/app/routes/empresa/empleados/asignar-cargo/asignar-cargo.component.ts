import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SucursalService } from '../../../../services/sucursal.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { SucursalClienteDto } from '../../../../dto/SucursalClienteDto';
import { AsignarSucursalClienteDto } from '../../../../dto/AsignarSucursalClienteDto';
import { EmpleadosService } from 'app/services/empleados.service';
import { CargoDTO } from 'app/dto/CargoDTO';

@Component({
  selector: 'app-asignar-cargo',
  templateUrl: './asignar-cargo.component.html',
  styleUrls: ['./asignar-cargo.component.css'],
})
export class AsignarCargoComponent implements OnInit {
  @Input() empleadoId: any;
  @Input() departamentoId: any;
  @Input() watchMode: boolean = false;
  @Input() cargoId: any;
  displayedColumns: string[] = ['seleccione', 'nombre', 'descripcion'];
  dataSource: SucursalClienteDto[] = [];
  elementosSeleccionados: SucursalClienteDto[] = [];
  idCargo: number|null;
  selectedCargo: any;
  constructor(
    public dialogRef: MatDialogRef<AsignarCargoComponent>,
    private empleadosService: EmpleadosService,
    private toast: ToastService,
  ) {
  }

  ngOnInit() {
    this.cargarCargo();
  }

  cargarCargo() {
    this.empleadosService.obtenerCargoPorDepartamento(this.departamentoId).subscribe(
      (datos) => {
        this.dataSource = datos.data;
        console.log(this.dataSource.find((cargo) => cargo.id === this.cargoId)?.id);
        this.selectedCargo = this.dataSource.find((cargo) => cargo.id === this.cargoId)?.id;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  seleccionarElemento(cargo: CargoDTO) {
    this.idCargo = cargo.id;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarAsignacion() {
    const asignarDepartamento = {
      idEmpleado: this.empleadoId,
      idCargo: this.idCargo,

    };
    this.empleadosService.asignarCargo(asignarDepartamento).subscribe(
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
