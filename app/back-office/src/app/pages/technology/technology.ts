import { EditorComponent } from '#BO/common/ui/editor/editor';
import { FileUploadComponent } from '#BO/common/ui/file-upload/file-upload';
import { ItemPreviewComponent } from '#BO/common/ui/item-preview/item-preview';
import { LevelBarComponent } from '#BO/common/ui/level-bar/level-bar';
import { ToggleComponent } from '#BO/common/ui/toggle/toggle';
import { CrudPage } from '#common/shared/crud-page';
import { ButtonComponent } from '#common/ui/button/button';
import { DialogComponent } from '#common/ui/dialog/dialog';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { TableComponent } from '#common/ui/table/table';
import { FileService } from '#services/common/file.service';
import { TechnologyService } from '#services/technology/technology.service';
import { formatStringLabel } from '#shared/utils/string.utils';
import { Technology, TechnologyType } from '#SModels/technology.model';
import { isValidWebsite } from '#SUtils/validation.utils';
import { ToastUtils } from '#utils/toastUtils';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-technology',
  imports: [
    CommonModule,
		FormsModule,
    TranslateModule,
    ButtonComponent,
    DialogComponent,
    FormComponent,
		FileUploadComponent,
		EditorComponent,
		LevelBarComponent,
		ItemPreviewComponent,
		ToggleComponent,
    InputComponent,
    TableComponent
  ],
  templateUrl: './technology.html',
  styleUrl: './technology.scss'
})
export class TechnologyPage extends CrudPage<Technology> {
  columns = [
    { key: 'logo', label: 'COMMON.LOGO' },
    { key: 'name', label: 'COMMON.NAME' },
    { key: 'types', label: 'TECHNOLOGY.TYPE' },
    { key: 'proficiency', label: 'TECHNOLOGY.PROFICIENCY' },
    { key: 'isFavorite', label: 'COMMON.IS_FAVORITE' },
  ];

  technologyName: Technology['name'] = '';
  technologyDescription: Technology['description'] = '';
  technologyProficiency: Technology['proficiency'] = 0;
  technologyDocumentationUrl: Technology['documentationUrl'] = '';
  technologyColor: Technology['color'] = '#000000';
  technologyTypes: Technology['types'] = [];
  technologyIsFavorite: Technology['isFavorite'] = false;
	technologyLogo: File | null = null;
	technologyLogoPreviewUrl: string | null = null;

  isValidWebsite = isValidWebsite;
	formatStringLabel = formatStringLabel;

	get nameInvalid() { return !this.technologyName || this.technologyName.trim() === ''; }
	get documentationUrlInvalid() {
		return !this.technologyDocumentationUrl || this.technologyDocumentationUrl.trim() === '' ||
			!this.isValidWebsite(this.technologyDocumentationUrl);
	}
	get logoInvalid() { return !this.technologyLogo && this.modalMode === 'create'; }
	get colorInvalid() { return !this.technologyColor || this.technologyColor.trim() === ''; }
	get typesInvalid() { return this.technologyTypes.length === 0; }
	get formInvalid() {
		return this.nameInvalid ||
		this.documentationUrlInvalid ||
		this.logoInvalid ||
		this.colorInvalid ||
		this.typesInvalid;
	}
  get modalHeaderTitle(): string {
    switch (this.modalMode) {
      case 'create': return this.translate.instant('TECHNOLOGY.MODAL.CREATE');
      case 'update': return this.translate.instant('TECHNOLOGY.MODAL.EDIT');
      case 'show':   return this.translate.instant('TECHNOLOGY.MODAL.VIEW');
      default:       return '';
    }
  }

	technologyTypesList: TechnologyType[] = [
		'ANALYTICS',
		'API',
		'ARTIFICIAL_INTELLIGENCE',
		'AUTOMATION',
		'BACKEND',
		'BLOCKCHAIN',
		'CLOUD',
		'CMS',
		'CONTAINERIZATION',
		'CYBER_SECURITY',
		'DATA_SCIENCE',
		'DATABASE',
		'DESKTOP',
		'DEVOPS',
		'ECOMMERCE',
		'EMBEDDED',
		'FRONTEND',
		'FULLSTACK',
		'GAME_DEVELOPMENT',
		'INFRASTRUCTURE',
		'IOT',
		'MACHINE_LEARNING',
		'MOBILE',
		'NETWORKING',
		'OPERATING_SYSTEM',
		'OTHER',
		'SCRIPTING',
		'TESTING',
		'UI_UX',
		'VIRTUALIZATION',
		'WEB_SERVER'
	];

  constructor(
    private readonly technologyService: TechnologyService,
    private readonly fileService: FileService,
    public override translate: TranslateService,
    protected override toast: ToastUtils
  ) {
    super(toast, translate);
    this.loadItems();
  }

  loadItems(): void {
    this.technologyService.getAllTechnologies().subscribe({
      next: (technologies: Technology[]) => {
        this.items = technologies;
        if (this.items.length === 0) {
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

	onLogoSelected(file: File) {
		this.technologyLogo = file;
		this.technologyLogoPreviewUrl = null;
	}

	onToggleType(type: TechnologyType, checked: boolean) {
		if (checked) {
			if (!this.technologyTypes.includes(type)) {
				this.technologyTypes = [...this.technologyTypes, type];
			}
		} else {
			this.technologyTypes = this.technologyTypes.filter(t => t !== type);
		}
	}

	formatTypes(types: TechnologyType[] | undefined): string | null {
		if (!types || types.length === 0 || types === undefined) {
			console.warn('No types provided for formatting');
			return null;
		}
    return types.map(type => this.formatStringLabel(type)).join(', ');
	}

	onSubmitForm(data: any) {
		console.log('data', data);
		if (this.modalMode === 'create') {
			this.createItem(data);
		} else if (this.modalMode === 'update' && this.selectedItem?.id) {
			this.updateItem(this.selectedItem.id);
		}
	}

	async createItem(data: any): Promise<void> {
		this.isLoading = true;
		try {
			let logoFileId: number | undefined = undefined;

			if (this.technologyLogo) {
				logoFileId = await this.uploadFileAndGetId(this.technologyLogo, this.technologyName);
			}

      const payload: Technology = {
        name: this.technologyName,
        description: this.technologyDescription,
        proficiency: this.technologyProficiency,
        documentationUrl: this.technologyDocumentationUrl,
        color: this.technologyColor,
        types: this.technologyTypes,
        isFavorite: this.technologyIsFavorite,
        logo: logoFileId
          ? {
							id: logoFileId,
              fileId: logoFileId,
              fileName: this.technologyLogo ? this.technologyLogo.name : '',
              url: this.technologyLogoPreviewUrl || '',
            }
          : null
      };

      // Appel à l'API pour créer la technologie
      await firstValueFrom(this.technologyService.createTechnology(payload));

			this.toast.success(this.translate.instant('TOAST.TECHNOLOGY.CREATED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
			this.closeModal();
			this.loadItems();
		} catch (error) {
			this.toast.error(this.translate.instant('TOAST.TECHNOLOGY.ERROR_CREATE'), this.translate.instant('TOAST.TITLE.ERROR'));
			console.error(error);
		} finally {
			this.isLoading = false;
		}
	}

	private async uploadFileAndGetId(file: File, name: string): Promise<number | undefined> {
		const uploadData = new FormData();
		uploadData.append('file', file);
		uploadData.append('name', name);
		const uploadResp: any = await firstValueFrom(this.fileService.uploadLogo(uploadData));
		return uploadResp?.success && uploadResp.data?.id ? uploadResp.data.id : undefined;
	}

  async updateItem(id: number): Promise<void> {
    this.isLoading = true;
    try {
			let logoFileId: number | undefined = undefined;
			if (this.technologyLogo) {
				logoFileId = await this.uploadFileAndGetId(this.technologyLogo, this.technologyName);
			}

			const data: Technology = {
				id,
				name: this.technologyName,
				description: this.technologyDescription,
				proficiency: this.technologyProficiency,
				documentationUrl: this.technologyDocumentationUrl,
				color: this.technologyColor,
				types: this.technologyTypes,
				isFavorite: this.technologyIsFavorite,
				logo: logoFileId
					? {
							id: logoFileId,
							fileId: logoFileId,
							fileName: this.technologyLogo ? this.technologyLogo.name : '',
							url: this.technologyLogoPreviewUrl || '',
						}
					: null
			};

      await firstValueFrom(this.technologyService.updateTechnology(id, data));
      this.toast.success(this.translate.instant('TOAST.TECHNOLOGY.UPDATED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
      this.closeModal();
      this.loadItems();
    } catch (error) {
      this.toast.error(this.translate.instant('TOAST.TECHNOLOGY.ERROR_UPDATE'), this.translate.instant('TOAST.TITLE.ERROR'));
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteItem(id: number): Promise<void> {
    this.isLoading = true;
    try {
      await firstValueFrom(this.technologyService.deleteTechnology(id));
      this.toast.success(this.translate.instant('TOAST.TECHNOLOGY.SUCCESS_DELETED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
      this.loadItems();
    } catch (error) {
      this.toast.error(this.translate.instant('TOAST.TECHNOLOGY.ERROR_DELETE'), this.translate.instant('TOAST.TITLE.ERROR'));
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  protected resetForm(): void {
    this.technologyName = '';
    this.technologyDescription = '';
    this.technologyProficiency = 0;
    this.technologyDocumentationUrl = '';
		this.technologyLogo = null;
		this.technologyLogoPreviewUrl = null;
    this.technologyColor = '#000000';
    this.technologyTypes = [];
    this.technologyIsFavorite = false;
    this.selectedItem = null;
  }

	public resetFormPublic(): void {
		this.resetForm();
	}

  openUpdateTechnologyModal(technology: Technology) {
    this.openUpdateModal(technology);
    this.technologyName = technology.name;
    this.technologyDescription = technology.description || '';
    this.technologyProficiency = technology.proficiency || 0;
    this.technologyDocumentationUrl = technology.documentationUrl || '';
		this.technologyLogo = null;
		this.technologyLogoPreviewUrl = technology.logo ? technology.logo.url : null;
    this.technologyColor = technology.color || '#000000';
    this.technologyTypes = technology.types || [];
    this.technologyIsFavorite = technology.isFavorite || false;
  }

  onRowClick(technology: Technology) {
    this.openShowModal(technology);
  }

  deleteTechnology(technology: Technology) {
    if (technology.id) {
      this.deleteItem(technology.id);
    }
  }
}