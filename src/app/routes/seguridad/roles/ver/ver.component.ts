import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {RolDto} from "../../../../dto/RolDto";

@Component({
  selector: 'app-seguridad-roles-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class SeguridadRolesVerComponent implements OnInit {

  @Input() rol: any;
  @Input() watchMode: boolean = false;

  rol_view: RolDto | undefined;
  constructor(private editDialog: MatDialogRef<SeguridadRolesVerComponent>) { }

  ngOnInit() {
    //alert(localStorage.getItem('cod_suc'))
    this.rol_view = this.rol;
  }
  closeDialog(): void {
    this.editDialog.close();
  }

}
