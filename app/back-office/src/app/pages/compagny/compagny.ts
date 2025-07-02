import { ButtonComponent } from '#common/ui/button/button';
import { DialogComponent } from '#common/ui/dialog/dialog';
import { EditorComponent } from '#common/ui/editor/editor';
import { FileUploadComponent } from '#common/ui/file-upload/file-upload';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { ItemPreviewComponent } from '#common/ui/item-preview/item-preview';
import { TableComponent } from '#common/ui/table/table';
import { environment } from '#env/environment';
import { FileService } from '#services/common/file.service';
import { CompagnyService } from '#services/compagny/compagny.service';
import { CompagnyContact } from '#shared/models/compagny-contact.model';
import { Compagny } from '#shared/models/compagny.model';
import { Picture } from '#shared/models/picture.model';
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
		ItemPreviewComponent
	],
  templateUrl: './compagny.html',
  styleUrl: './compagny.scss'
})
export class CompagnyPage {
	constructor(
		private readonly compagnyService: CompagnyService,
		private readonly fileService: FileService,
		private translate: TranslateService,
		private toast: ToastUtils,
	) {
		this.loadCompagnies();
	}

	compagnies: Compagny[] = [];
	columns: { key: string, label: string }[] = [];
	showDialog = false;
	isLoading = false;

	compagnyName: string = '';
	compagnyWebsite: string = '';
	compagnyColor: string = '';
	compagnyLogo: File | null = null;
	compagnyDescription: string = '';
	compagnyContacts: CompagnyContact[] = [];

  isValidWebsite = isValidWebsite;

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

  get formInvalid() {
    return this.nameInvalid || this.websiteInvalid || this.colorInvalid || this.descriptionInvalid;
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
		this.showDialog = true;
	}

	async onCreateCompagny(formData: any) {
		this.isLoading = true;

		try {
			let logoFileId: number | undefined;

			if (this.compagnyLogo) {
				const uploadData = new FormData();
				uploadData.append('file', this.compagnyLogo);
				uploadData.append('name', this.compagnyName);

				const uploadResp: any = await firstValueFrom(this.fileService.uploadLogo(uploadData));
				if (uploadResp?.success && uploadResp.data?.id) {
					logoFileId = uploadResp.data.id;
				}
			}

			const createRequest = {
				name: this.compagnyName,
				description: this.compagnyDescription,
				color: this.compagnyColor,
				website: this.compagnyWebsite,
				pictures: logoFileId
					? [{ fileId: logoFileId, isLogo: true, isMaster: true }]
					: [],
				contacts: this.compagnyContacts.map((contact: CompagnyContact) => ({
					lastname: contact.lastname,
					firstname: contact.firstname,
					position: contact.position,
					email: contact.email,
					phone: contact.phone,
					pictureId: (contact.picture && 'id' in contact.picture) ? (contact.picture as Picture).id : null
				}))
			};

			await firstValueFrom(this.compagnyService.createCompagny(createRequest));

			this.toast.success(
				this.translate.instant('TOAST.COMPAGNY.SUCCESS_CREATE'),
				this.translate.instant('TOAST.TITLE.SUCCESS')
			);
			this.closeCreateCompagnyModal();
			this.loadCompagnies();
		} catch (err) {
			this.toast.error(
				this.translate.instant('TOAST.COMPAGNY.ERROR_CREATE'),
				this.translate.instant('TOAST.TITLE.ERROR')
			);
			console.error(err);
		} finally {
			this.isLoading = false;
		}
	}

	closeCreateCompagnyModal() {
		this.showDialog = false;
	}
}
