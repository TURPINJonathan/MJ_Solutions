import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastUtils {

  constructor(private toastr: ToastrService) {}

  success(message: string, title = 'Succès', config?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, { ...config });
  }

  error(message: string, title = 'Erreur', config?: Partial<IndividualConfig>) {
    this.toastr.error(message, title, { ...config });
  }

  info(message: string, title = 'Info', config?: Partial<IndividualConfig>) {
    this.toastr.info(message, title, { ...config });
  }

  warning(message: string, title = 'Attention', config?: Partial<IndividualConfig>) {
    this.toastr.warning(message, title, { ...config });
  }
}