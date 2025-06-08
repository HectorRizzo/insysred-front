import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import * as L from 'leaflet';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.css']
})
export class ModalMapComponent {

  @Input() title: string;
  @Input() message: string;
  @Input() latitude: number;
  @Input() longitude: number;

  @Output() latlong: EventEmitter<any> = new EventEmitter();

  latLong: [number, number] = [0, 0];
  constructor(private dialogRef: MatDialogRef<ModalMapComponent>) {
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  

  initMap(): void {
    this.latLong = [this.latitude, this.longitude];
    const map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 15,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '...'
        })
      ]
    });

    const marker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      console.log('latitude', position.lat);
        console.log('longitude', position.lng);
        this.latLong = [position.lat, position.lng];
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  save(): void {
    console.log('save');
    this.latlong.emit(this.latLong);
    this.dialogRef.close();
  }

  close(): void {
    console.log('close');
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }
}