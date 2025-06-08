import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SucursalService } from '../../../../services/sucursal.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { SucursalClienteDto } from '../../../../dto/SucursalClienteDto';
import { AsignarSucursalClienteDto } from '../../../../dto/AsignarSucursalClienteDto';

@Component({
  selector: 'app-clientes-cliente-addScuc',
  templateUrl: './add-scuc.component.html',
  styleUrls: ['./add-scuc.component.css'],
})
export class ClientesClienteAddScucComponent implements OnInit {
  @Input() clienteDto: any;
  @Input() watchMode: boolean = false;
  displayedColumns: string[] = ['seleccione', 'nombre', 'establecimiento', 'puntoEmision', 'secuencial'];
  dataSource: SucursalClienteDto[] = [];
  elementosSeleccionados: SucursalClienteDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<ClientesClienteAddScucComponent>,
    private servicio: SucursalService,
    private toast: ToastService,
  ) {
  }

  ngOnInit() {
    this.cargarSucursales();
  }

  cargarSucursales() {
    this.servicio.obtenerSucuralCliente(this.clienteDto.id).subscribe(
      (datos) => {
        this.dataSource = datos;
        datos.forEach(elemento => {
          if (elemento.cliente_presente) {
            this.elementosSeleccionados.push(elemento);
          }
        });
        this.dataSource.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }

  estaSeleccionado(cliente: SucursalClienteDto): boolean {
    this.elementosSeleccionados.some(e => e.cliente_presente === cliente.cliente_presente);
    return cliente.cliente_presente;
  }

  seleccionarElemento(sucursal: SucursalClienteDto) {
    const index = this.elementosSeleccionados.findIndex(e => e.id === sucursal.id);
    if (index !== -1) {
      this.elementosSeleccionados.splice(index, 1);
    } else {
      this.elementosSeleccionados.push(sucursal);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  guardarAsignacion() {
    const asignaSucursalCliente: AsignarSucursalClienteDto = {
      idCliente: this.clienteDto.id,
      idSucursal: this.elementosSeleccionados.map(elemento => elemento.id),

    };
    this.servicio.asignarSucursalCliente(asignaSucursalCliente).subscribe(
      (datos) => {
        this.toast.showMessage('Asignación de sucursales exitosa', MessageType.SUCCESS);
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      },
    );
  }
}
