import { ButtonComponent } from '#common/ui/button/button';
import { DialogComponent } from '#common/ui/dialog/dialog';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { TableComponent } from '#common/ui/table/table';
import { Technology } from '#SModels/technology.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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
		{ key: 'type', label: 'TECHNOLOGY.TYPE' },
		{ key: 'proficiency', label: 'TECHNOLOGY.PROFICIENCY' },
		{ key: 'isFavorite', label: 'COMMON.IS_FAVORITE' },
	]

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
