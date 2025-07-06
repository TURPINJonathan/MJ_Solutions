import { ButtonComponent } from '#common/ui/button/button';
import { DialogComponent } from '#common/ui/dialog/dialog';
import { EditorComponent } from '#common/ui/editor/editor';
import { FileUploadComponent } from '#common/ui/file-upload/file-upload';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { ItemPreviewComponent } from '#common/ui/item-preview/item-preview';
import { SelectComponent } from '#common/ui/select/select';
import { TableComponent } from '#common/ui/table/table';
import { environment } from '#env/environment';
import { FileService } from '#services/common/file.service';
import { CompagnyService } from '#services/compagny/compagny.service';
import { CompagnyContact } from '#shared/models/compagny-contact.model';
import { Compagny } from '#shared/models/compagny.model';
import { Picture } from '#shared/models/picture.model';
import { formatDate } from '#shared/utils/date.utils';
import { isValidWebsite } from '#SUtils/validation.utils';
import { ToastUtils } from '#utils/toastUtils';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-compagny',
	standalone: true,
  imports: [
CommonModule,
		TranslateModule,
		TableComponent,
		ButtonComponent,
		DialogComponent,
		FormComponent,
		FormsModule,
		InputComponent,
		FileUploadComponent,
		EditorComponent,
		ItemPreviewComponent,
		SelectComponent
	],
  templateUrl: './compagny.html',
  styleUrl: './compagny.scss'
})
export class CompagnyPage {
	constructor(
		private readonly compagnyService: CompagnyService,
		private readonly fileService: FileService,
		public translate: TranslateService,
		private toast: ToastUtils,
	) {
		this.loadCompagnies();
	}

	compagnies: Compagny[] = [];
	columns: { key: string, label: string }[] = [];
	showDialog = false;
	modalMode: 'create' | 'update' | 'show' = 'create';
	selectedCompagny: Compagny | null = null;
	isLoading = false;

	compagnyName: string = '';
	compagnyWebsite: string = '';
	compagnyColor: string = '';
	compagnyLogo: File | null = null;
	compagnyDescription: string = '';
	compagnyContractStartAt: Date | null = null;
	compagnyContractEndAt: Date | null = null;
	compagnyType: 'CDI' | 'FREELANCE' | 'PROSPECT' = 'CDI'
	compagnyContacts: CompagnyContact[] = [];

  isValidWebsite = isValidWebsite;
	formatDate = formatDate;

	ngOnInit() {
		this.columns = [
			{ key: 'name', label: 'COMMON.NAME' },
			{ key: 'website', label: 'COMMON.WEBSITE' },
			{ key: 'logo', label: 'COMMON.LOGO' },
			{ key: 'type', label: 'COMPAGNY.TYPE' },
			{ key: 'createdAt', label: 'COMMON.CREATED_AT' },
			{ key: 'updatedAt', label: 'COMMON.UPDATED_AT' }
		]
	}

  get nameInvalid() {
    return !this.compagnyName || this.compagnyName.trim().length < 2;
  }
  get websiteInvalid() {
    return !this.compagnyWebsite || !isValidWebsite(this.compagnyWebsite);
  }
  get colorInvalid() {
    return !this.compagnyColor;
  }
  get descriptionInvalid() {
    return !this.compagnyDescription || this.compagnyDescription.trim().length < 5;
  }
	get typeInvalid() {
		return !this.compagnyType;
	}
	getContractStartAtInvalid() {
		return !this.compagnyContractStartAt || isNaN(this.compagnyContractStartAt.getTime());
	}
	getContractEndAtInvalid() {
		return !this.compagnyContractEndAt || isNaN(this.compagnyContractEndAt.getTime());
	}

  get formInvalid() {
    return this.nameInvalid || this.websiteInvalid || this.colorInvalid || this.descriptionInvalid;
  }

	get websiteLink(): string {
		if (!this.selectedCompagny?.website) return '';
		return `<a href="${this.selectedCompagny.website}" target="_blank" rel="noopener noreferrer">${this.selectedCompagny.website}</a>`;
	}
	
	get selectedCompagnyPicture(): Picture | null {
		return this.selectedCompagny?.pictures && this.selectedCompagny.pictures.length > 0
			? this.selectedCompagny.pictures[0]
			: null;
	}

	get modalHeaderTitle(): string {
		switch (this.modalMode) {
			case 'create':
				return this.translate.instant('COMPAGNY.MODAL.CREATE');
			case 'update':
				return this.translate.instant('COMPAGNY.MODAL.UPDATE');
			case 'show':
				return this.translate.instant('COMPAGNY.MODAL.VIEW');
			default:
				return '';
		}
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

	addContact() {
		this.compagnyContacts.push({
			lastname: '',
			firstname: '',
			position: '',
			email: '',
			phone: '',
			picture: null,
		})
	}

	removeContact(index: number) {
		this.compagnyContacts.splice(index, 1);
	}

	openCreateCompagnyModal() {
		this.modalMode = 'create';
		this.showDialog = true;
		this.selectedCompagny = null;
	}

	async onCreateCompagny(formData: any) {
		this.isLoading = true;

		try {
			let logoFileId: number | undefined;

			// Upload du logo principal
			if (this.compagnyLogo) {
				const uploadData = new FormData();
				uploadData.append('file', this.compagnyLogo);
				uploadData.append('name', this.compagnyName);

				const uploadResp: any = await firstValueFrom(this.fileService.uploadLogo(uploadData));
				if (uploadResp?.success && uploadResp.data?.id) {
					logoFileId = uploadResp.data.id;
				}
			}

			// Upload des images de contact si besoin
			const contactsWithPictureIds = [];
			for (const contact of this.compagnyContacts) {
				let pictureId = null;
				if (contact.picture instanceof File) {
					const uploadData = new FormData();
					uploadData.append('file', contact.picture);
					uploadData.append('name', `${contact.firstname} ${contact.lastname}`);
					const uploadResp: any = await firstValueFrom(this.fileService.uploadLogo(uploadData));
					if (uploadResp?.success && uploadResp.data?.id) {
						pictureId = uploadResp.data.id;
					}
				} else if (contact.picture && 'id' in contact.picture) {
					pictureId = (contact.picture as Picture).id;
				}
				contactsWithPictureIds.push({
					lastname: contact.lastname,
					firstname: contact.firstname,
					position: contact.position,
					email: contact.email,
					phone: contact.phone,
					pictureId: pictureId
				});
			}

			const createRequest = {
				name: this.compagnyName,
				description: this.compagnyDescription,
				color: this.compagnyColor,
				website: this.compagnyWebsite,
				contractStartAt: this.compagnyContractStartAt
						? new Date(this.compagnyContractStartAt).toISOString()
						: null,
				contractEndAt: this.compagnyContractEndAt
						? new Date(this.compagnyContractEndAt).toISOString()
						: null,
				type: this.compagnyType,
				pictures: logoFileId
					? [{ fileId: logoFileId, isLogo: true, isMaster: true }]
					: [],
				contacts: contactsWithPictureIds
			};

			await firstValueFrom(this.compagnyService.createCompagny(createRequest));

			this.toast.success(
				this.translate.instant('TOAST.COMPAGNY.SUCCESS_CREATED'),
				this.translate.instant('TOAST.TITLE.SUCCESS')
			);
			this.closeCreateCompagnyModal();
			this.loadCompagnies();
		} catch (err) {
			this.toast.error(
				this.translate.instant('TOAST.COMPAGNY.ERROR_CREATED'),
				this.translate.instant('TOAST.TITLE.ERROR')
			);
			console.error(err);
		} finally {
			this.isLoading = false;
		}
	}

	closeCreateCompagnyModal() {
		this.compagnyName = '';
		this.compagnyWebsite = '';
		this.compagnyColor = '';
		this.compagnyLogo = null;
		this.compagnyDescription = '';
		this.compagnyContractStartAt = null;
		this.compagnyContractEndAt = null;
		this.compagnyType = 'CDI';
		this.compagnyContacts = [];
		this.showDialog = false;
		this.selectedCompagny = null;
	}

	onShowCompagny(compagny: Compagny) {
		this.modalMode = 'show';
		this.selectedCompagny = compagny;
		this.showDialog = true;
	}
}
