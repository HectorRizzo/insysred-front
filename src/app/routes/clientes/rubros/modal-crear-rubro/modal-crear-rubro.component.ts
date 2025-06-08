import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { RubroDto } from 'app/dto/RubroDto';
import { RubroService } from 'app/services/rubro.service';

@Component({
  selector: 'app-modal-crear-rubro',
  templateUrl: './modal-crear-rubro.component.html',
  styleUrls: ['./modal-crear-rubro.component.scss'],
})
export class ModalCrearRubroComponent implements OnInit {
  @Input() rubro: RubroDto;

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalCrearRubroComponent>,
    private toast: ToastService,
    private fb: FormBuilder,
    private rubroService: RubroService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      nombre: [this.rubro?.nombre, [Validators.required, Validators.minLength(1)]],
      valor: [this.rubro?.valor, [Validators.required, Validators.min(0)]],
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  guardar() {
    const { nombre, valor } = this.form.value;
    this.rubroService.postRubro(nombre, valor, this.rubro?.id).subscribe({
      next: res => {
        this.toast.showMessage('Rubro creado con éxito', MessageType.SUCCESS);
        this.cancelar();
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }
}
