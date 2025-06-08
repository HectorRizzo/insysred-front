import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TipoBancoDto } from 'app/dto/TipoBancoDto';
import { BancosService } from 'app/services/bancos.service';
import { ArchivoBancoDto } from 'app/dto/ArchivoBancoDto';
import { CargarBancoVerComponent } from '../ver/cargar-banco-ver.component';
import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';

@Component({
  selector: 'app-cargar-banco-nuevo',
  templateUrl: './cargar-banco-nuevo.component.html',
  styleUrls: ['./cargar-banco-nuevo.component.scss'],
})
export class CargarBancoNuevoComponent implements OnInit {
  tipoBanco: TipoBancoDto[] = [];

  form: FormGroup;
  fileControl: FormControl;
  file: any;
  maxSize = 16;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CargarBancoNuevoComponent>,
    private fb: FormBuilder,
    private bancosService: BancosService
  ) {
    this.form = this.fb.nonNullable.group({
      tipoBanco: ['', [Validators.required]],
    });
    this.fileControl = new FormControl(this.file, [
      Validators.required,
      // MaxSizeValidator(this.maxSize * 1024),
    ]);
  }

  getAllTipoBanco() {
    this.bancosService.getAllTipoBanco().subscribe({
      next: tipos => {
        this.tipoBanco = tipos;
      },
      error: error => {},
    });
  }

  closeModal() {
    this.fileControl.get;
    this.dialogRef.close();
  }

  enviarArchivo() {
    const { tipoBanco } = this.form.value;
    if (!tipoBanco || !this.file) {
      return;
    }
    this.bancosService.postConciliacion(this.file, tipoBanco).subscribe({
      next: res => {
        this.openSeeModal(res);
        this.closeModal();
      },
      error: error => {
        console.log('error:', error);
      },
    });
  }

  openSeeModal(archivoConciliacion: ArchivoBancoDto) {
    const modalEdit = this.dialog.open(CargarBancoVerComponent, {
      width: '60%',
      height: '90%',
    });
    modalEdit.componentInstance.archivoConciliacion = archivoConciliacion;
  }

  ngOnInit(): void {
    this.getAllTipoBanco();
    this.fileControl.valueChanges.subscribe((file: any) => {
      this.file = file;
    });
  }
}
