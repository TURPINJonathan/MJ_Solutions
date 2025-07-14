import { ToastUtils } from '#utils/toastUtils';
import { TranslateService } from '@ngx-translate/core';

export abstract class CrudPage<T> {
  items: T[] = [];
  isLoading = false;
  showDialog = false;
  modalMode: 'create' | 'update' | 'show' = 'create';
  selectedItem: T | null = null;

  constructor(
    protected toast: ToastUtils,
    public translate: TranslateService
  ) {}

  abstract loadItems(): void;
  abstract createItem(data: any): Promise<void>;
  abstract updateItem(id: number, data: any): Promise<void>;
  abstract deleteItem(id: number): Promise<void>;

  openCreateModal() {
    this.resetForm();
    this.modalMode = 'create';
    this.showDialog = true;
  }

  openUpdateModal(item: T) {
    this.selectedItem = item;
    this.modalMode = 'update';
    this.showDialog = true;
  }

  openShowModal(item: T) {
    this.selectedItem = item;
    this.modalMode = 'show';
    this.showDialog = true;
  }

  closeModal() {
    this.resetForm();
    this.showDialog = false;
    this.selectedItem = null;
  }

  protected abstract resetForm(): void;
}