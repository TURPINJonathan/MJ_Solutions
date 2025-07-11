import { FileService } from '#BO/services/common/file.service';
import { TechnologyService } from '#BO/services/technology/technology.service';
import { ToastUtils } from '#BO/utils/toastUtils';
import { ButtonComponent } from '#common/ui/button/button';
import { DialogComponent } from '#common/ui/dialog/dialog';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { TableComponent } from '#common/ui/table/table';
import { Technology } from '#SModels/technology.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-technology',
  imports: [
		CommonModule,
		TranslateModule,
		ButtonComponent,
		DialogComponent,
		FormComponent,
		InputComponent,
		TableComponent
	],
  templateUrl: './technology.html',
  styleUrl: './technology.scss'
})
export class TechnologyPage {
	technologies: Technology[] = [];

	columns = [
		{ key: 'logo', label: 'COMMON.LOGO' },
		{ key: 'name', label: 'COMMON.NAME' },
		{ key: 'types', label: 'TECHNOLOGY.TYPE' },
		{ key: 'proficiency', label: 'TECHNOLOGY.PROFICIENCY' },
		{ key: 'isFavorite', label: 'COMMON.IS_FAVORITE' },
	]

	constructor(
		private readonly technologyService: TechnologyService,
		private readonly fileService: FileService,
		public translate: TranslateService,
		private toast: ToastUtils
	) {
		this.loadTechnologies();
	}

	loadTechnologies() {
		this.technologyService.getAllTechnologies().subscribe({
			next: (technologies: Technology[]) => {
				this.technologies = technologies

				if (this.technologies.length === 0) {
					this.toast.info(this.translate.instant('TOAST.TECHNOLOGY.EMPTY_LIST'), this.translate.instant('TOAST.TITLE.INFO'));
				} else {
					this.toast.success(this.translate.instant('TOAST.TECHNOLOGY.SUCCESS_LIST'), this.translate.instant('TOAST.TITLE.SUCCESS'));
				}
			},
			error: (error) => {
        this.toast.error(this.translate.instant('TOAST.TECHNOLOGY.ERROR_LIST'), this.translate.instant('TOAST.TITLE.ERROR'));
        console.error('Error loading technologies:', error);
			}
		});
	}

	openCreateTechnologyModal() {
		console.log('Open create technology modal');
	}

	onRowClick(technology: any) {
		console.log('Row clicked:', technology);
	}

	openUpdateTechnologyModal(technology: any) {
		console.log('Open update technology modal for:', technology);
	}

	deleteTechnology(technology: any) {
		console.log('Delete technology:', technology);
	}
}
