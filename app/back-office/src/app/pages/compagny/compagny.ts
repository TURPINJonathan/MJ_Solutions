import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

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
  compagnies: Compagny[] = [];
  columns = [
    { key: 'name', label: 'COMMON.NAME' },
    { key: 'website', label: 'COMMON.WEBSITE' },
    { key: 'logo', label: 'COMMON.LOGO' },
    { key: 'type', label: 'COMPAGNY.TYPE' },
    { key: 'createdAt', label: 'COMMON.CREATED_AT' },
    { key: 'updatedAt', label: 'COMMON.UPDATED_AT' }
  ];

  showDialog = false;
  modalMode: 'create' | 'update' | 'show' = 'create';
  selectedCompagny: Compagny | null = null;
  isLoading = false;

  compagnyName = '';
  compagnyWebsite = '';
  compagnyColor = '';
  compagnyLogo: File | null = null;
  compagnyLogoPreviewUrl: string | null = null;
  compagnyDescription = '';
  compagnyContractStartAt: Date | null = null;
  compagnyContractEndAt: Date | null = null;
  compagnyType: 'CDI' | 'FREELANCE' | 'PROSPECT' = 'CDI';
  compagnyContacts: CompagnyContact[] = [];

  isValidWebsite = isValidWebsite;
  formatDate = formatDate;

  constructor(
    private readonly compagnyService: CompagnyService,
    private readonly fileService: FileService,
    public translate: TranslateService,
    private toast: ToastUtils,
  ) {
    this.loadCompagnies();
  }

  get nameInvalid() { return !this.compagnyName || this.compagnyName.trim().length < 2; }
  get websiteInvalid() { return !this.compagnyWebsite || !isValidWebsite(this.compagnyWebsite); }
  get colorInvalid() { return !this.compagnyColor; }
  get descriptionInvalid() { return !this.compagnyDescription || this.compagnyDescription.trim().length < 5; }
  get typeInvalid() { return !this.compagnyType; }
  getContractStartAtInvalid() { return !this.compagnyContractStartAt || isNaN(this.compagnyContractStartAt.getTime()); }
  getContractEndAtInvalid() { return !this.compagnyContractEndAt || isNaN(this.compagnyContractEndAt.getTime()); }
  get formInvalid() { return this.nameInvalid || this.websiteInvalid || this.colorInvalid || this.descriptionInvalid; }

  get websiteLink(): string {
    if (!this.selectedCompagny?.website) return '';
    return `<a href="${this.selectedCompagny.website}" target="_blank" rel="noopener noreferrer">${this.selectedCompagny.website}</a>`;
  }

  get selectedCompagnyPicture(): Picture | null {
    return this.selectedCompagny?.pictures?.find((img: any) => img.isLogo) || null;
  }

  get modalHeaderTitle(): string {
    switch (this.modalMode) {
      case 'create': return this.translate.instant('COMPAGNY.MODAL.CREATE');
      case 'update': return this.translate.instant('COMPAGNY.MODAL.EDIT');
      case 'show':   return this.translate.instant('COMPAGNY.MODAL.VIEW');
      default:       return '';
    }
  }

  loadCompagnies() {
    this.compagnyService.getAllCompagnies().subscribe({
      next: (compagnies: Compagny[]) => {
        this.compagnies = compagnies.map(compagny => ({
          ...compagny,
          logoUrl: compagny.pictures?.find((img: any) => img.isLogo)
            ? `${environment.apiUrl}${compagny.pictures.find((img: any) => img.isLogo)?.url}`
            : undefined
        }));
        if (compagnies.length === 0) {
          this.toast.info(this.translate.instant('TOAST.COMPAGNY.EMPTY_LIST'), this.translate.instant('TOAST.TITLE.INFO'));
        } else {
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
    });
  }

  removeContact(index: number) {
    this.compagnyContacts.splice(index, 1);
  }

  openCreateCompagnyModal() {
    this.resetForm();
    this.modalMode = 'create';
    this.showDialog = true;
  }

  openUpdateCompagnyModal(compagny: Compagny) {
    this.modalMode = 'update';
    this.showDialog = true;
    this.selectedCompagny = compagny;

    this.compagnyName = compagny.name;
    this.compagnyWebsite = compagny.website || '';
    this.compagnyColor = compagny.color || '';
    this.compagnyLogo = null;
    this.compagnyDescription = compagny.description || '';
    this.compagnyContractStartAt = compagny.contractStartAt ? new Date(compagny.contractStartAt) : null;
    this.compagnyContractEndAt = compagny.contractEndAt ? new Date(compagny.contractEndAt) : null;
    this.compagnyType = compagny.type;
    this.compagnyContacts = compagny.contacts ? compagny.contacts.map(c => ({
      ...c,
      picture: c.picture || null
    })) : [];

    const logo = compagny.pictures?.find((img: any) => img.isLogo);
    this.compagnyLogoPreviewUrl = logo ? `${environment.apiUrl}${logo.url}` : null;
  }

  closeCreateCompagnyModal() {
    this.resetForm();
    this.showDialog = false;
    this.selectedCompagny = null;
  }

  onUpdateClick(compagny: Compagny) {
    this.openUpdateCompagnyModal(compagny);
  }

  onShowCompagny(compagny: Compagny) {
    this.modalMode = 'show';
    this.selectedCompagny = compagny;
    this.showDialog = true;
  }

	onDeleteCompagny(compagny: Compagny) {
		this.isLoading = true;
		
		this.compagnyService.deleteCompagny(Number(compagny.id)).subscribe({
			next: () => {
				this.toast.success(this.translate.instant('TOAST.COMPAGNY.SUCCESS_DELETED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
				this.loadCompagnies();
			},
			error: (error) => {
				this.toast.error(this.translate.instant('TOAST.COMPAGNY.ERROR_DELETED'), this.translate.instant('TOAST.TITLE.ERROR'));
				console.error('Error deleting compagny:', error);
			}
		}).add(() => {
			this.isLoading = false;
		});
	}

  onLogoSelected(file: File) {
    this.compagnyLogo = file;
    this.compagnyLogoPreviewUrl = null;
  }

  async onSubmitCompagny(formData: any) {
    this.isLoading = true;
    try {
      let logoFileId: number | undefined = undefined;

      if (this.compagnyLogo) {
        logoFileId = await this.uploadFileAndGetId(this.compagnyLogo, this.compagnyName);
      } else if (this.modalMode === 'update' && this.selectedCompagny?.pictures?.length) {
        const logo = this.selectedCompagny.pictures.find((img: any) => img.isLogo);
        if (logo) logoFileId = logo.id || logo.id;
      }

      const contactsWithPictureIds = await this.mapContactsWithPictureIds();

      const requestPayload = {
        name: this.compagnyName,
        description: this.compagnyDescription,
        color: this.compagnyColor,
        website: this.compagnyWebsite,
        contractStartAt: this.compagnyContractStartAt ? new Date(this.compagnyContractStartAt).toISOString() : null,
        contractEndAt: this.compagnyContractEndAt ? new Date(this.compagnyContractEndAt).toISOString() : null,
        type: this.compagnyType,
        pictures: logoFileId ? [{ fileId: logoFileId, isLogo: true, isMaster: true }] : [],
        contacts: contactsWithPictureIds
      };

      if (this.modalMode === 'create') {
        await firstValueFrom(this.compagnyService.createCompagny(requestPayload));
        this.toast.success(this.translate.instant('TOAST.COMPAGNY.SUCCESS_CREATED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
      } else if (this.modalMode === 'update' && this.selectedCompagny) {
        await firstValueFrom(this.compagnyService.updateCompagny(Number(this.selectedCompagny.id), requestPayload));
        this.toast.success(this.translate.instant('TOAST.COMPAGNY.SUCCESS_UPDATED'), this.translate.instant('TOAST.TITLE.SUCCESS'));
      }

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

  private async uploadFileAndGetId(file: File, name: string): Promise<number | undefined> {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('name', name);
    const uploadResp: any = await firstValueFrom(this.fileService.uploadLogo(uploadData));
    return uploadResp?.success && uploadResp.data?.id ? uploadResp.data.id : undefined;
  }

  private async mapContactsWithPictureIds() {
    const contactsWithPictureIds = [];
    for (const contact of this.compagnyContacts) {
      let pictureId = null;
      if (contact.picture instanceof File) {
        pictureId = await this.uploadFileAndGetId(contact.picture, `${contact.firstname} ${contact.lastname}`);
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
    return contactsWithPictureIds;
  }

  private resetForm() {
    this.compagnyName = '';
    this.compagnyWebsite = '';
    this.compagnyColor = '';
    this.compagnyLogo = null;
    this.compagnyLogoPreviewUrl = null;
    this.compagnyDescription = '';
    this.compagnyContractStartAt = null;
    this.compagnyContractEndAt = null;
    this.compagnyType = 'CDI';
    this.compagnyContacts = [];
  }
}