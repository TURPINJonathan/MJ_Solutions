import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastUtils {

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  success(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.success(
      message,
      title ?? this.translate.instant('TOAST.TITLE.SUCCESS'),
      { ...config }
    );
  }

  error(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.error(
      message,
      title ?? this.translate.instant('TOAST.TITLE.ERROR'),
      { ...config }
    );
  }

  info(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.info(
      message,
      title ?? this.translate.instant('TOAST.TITLE.INFO'),
      { ...config }
    );
  }

  warning(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.warning(
      message,
      title ?? this.translate.instant('TOAST.TITLE.WARNING'),
      { ...config }
    );
  }
}