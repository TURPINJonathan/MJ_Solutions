import { ToastUtils } from '#BO/utils/toastUtils';
import { ButtonComponent } from '#common/ui/button/button';
import { TableComponent } from '#common/ui/table/table';
import { environment } from '#env/environment';
import { CompagnyService } from '#services/compagny/compagny.service';
import { Compagny } from '#shared/models/compagny.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-compagny',
	standalone: true,
  imports: [
CommonModule,
		TranslateModule,
		TableComponent,
		ButtonComponent
	],
  templateUrl: './compagny.html',
  styleUrl: './compagny.scss'
})
export class CompagnyPage {
	constructor(
		private readonly compagnyService: CompagnyService,
		private translate: TranslateService,
		private toast: ToastUtils,
	) {
		this.loadCompagnies();
	}

	compagnies: Compagny[] = [];
	columns: { key: string, label: string }[] = [];

	ngOnInit() {
		this.columns = [
			{ key: 'name', label: 'COMMON.NAME' },
			{ key: 'website', label: 'COMMON.WEBSITE' },
			{ key: 'color', label: 'COMMON.COLOR' },
			{ key: 'logo', label: 'COMMON.LOGO' },
			{ key: 'createdAt', label: 'COMMON.CREATED_AT' },
			{ key: 'updatedAt', label: 'COMMON.UPDATED_AT' }
		]
	}

	loadCompagnies() {
		this.compagnyService.getAllCompagnies().subscribe({
			next: (compagnies: Compagny[]) => {
				if (compagnies.length === 0) {
					this.toast.info(this.translate.instant('TOAST.COMPAGNY.EMPTY_LIST'), this.translate.instant('TOAST.TITLE.INFO'));
				} else {
					this.compagnies = compagnies.map(compagny => ({
						...compagny,
						logoUrl: compagny.pictures?.find((img: any) => img.logo)
						? `${environment.apiUrl}${compagny.pictures.find((img: any) => img.logo)?.url}`
							: undefined
					}));
					this.toast.success(this.translate.instant('TOAST.COMPAGNY.SUCCESS_LIST'), this.translate.instant('TOAST.TITLE.SUCCESS'));
				}
			},
			error: (error) => {
				this.toast.error(this.translate.instant('TOAST.COMPAGNY.ERROR_LIST'), this.translate.instant('TOAST.TITLE.ERROR'));
				console.error('Error loading compagnies:', error);
			}
		});
	}

	openCreateCompagnyModal() {
		console.log('Open create compagny modal');
	}
}
