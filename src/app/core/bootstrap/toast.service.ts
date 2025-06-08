import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export enum MessageType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING'
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private toast: ToastrService) {}

  showMessage(message: string, messageType: MessageType){
    switch (messageType) {
      case 'SUCCESS':
        this.toast.success(message);
        break;
      case 'ERROR':
        this.toast.error(message);
        break;
      case 'INFO':
        this.toast.info(message);
        break; 
      case 'WARNING':
        this.toast.warning(message);
        break;
    
      default:
        this.toast.show(message);
        break;
    }
  }

}