import {
  Component,
  EventEmitter,
  HostBinding,
  Input, OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import screenfull from 'screenfull';
import {SucursalService} from '../../services/sucursal.service';
import {SucursalDto} from '../../dto/SucursalDto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  dataSouce: SucursalDto[] = [];

  @HostBinding('class') class = 'matero-header';

  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  idSucursal: number = 0;

  constructor(private servicio: SucursalService) {}

  ngOnInit() {
    this.cargarSucursales();
  }

  cargarSucursales() {
    const valorCookie = localStorage.getItem('cod_suc');
    this.idSucursal = valorCookie ? +valorCookie : 0;
    this.servicio.obtenerSucursalesXUsuario(localStorage.getItem('id_usuario_insysred')).subscribe(
      (datos) => {
        this.dataSouce = datos;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
      }
    );
  }

  onSelectionChange(event: any){
    this.idSucursal = event.value;
    const currentSucursalId = localStorage.getItem('cod_suc');
    const newSucursalId = String(this.idSucursal);
    if (currentSucursalId !== newSucursalId){
      localStorage.setItem('cod_suc', this.idSucursal.toString());
      location.reload();
    }
  }

}
