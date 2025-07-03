import { ButtonComponent } from '#common/ui/button/button';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogComponent } from './dialog';

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogComponent>;
  let component: DialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogComponent,
        ButtonComponent,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the dialog', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header if header input is set', () => {
    component.header = 'Test Header';
    component.open = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-header')).toBeTruthy();
    expect(compiled.querySelector('.modal-title')?.textContent).toContain('Test Header');
  });

  it('should not render the header if header input is not set', () => {
    component.header = undefined;
    component.open = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-header')).toBeFalsy();
  });

  it('should emit closed after animation when close is called', fakeAsync(() => {
    spyOn(component.closed, 'emit');
    component.close();
    expect(component.isClosing).toBeTrue();
    tick(350);
    expect(component.closed.emit).toHaveBeenCalled();
    expect(component.isClosing).toBeFalse();
  }));

  it('should toggle fullscreen mode', () => {
    expect(component.isFullscreen).toBeFalse();
    component.toggleFullscreen();
    expect(component.isFullscreen).toBeTrue();
    component.toggleFullscreen();
    expect(component.isFullscreen).toBeFalse();
  });

  it('should add .out class when closing', () => {
    component.open = true;
    component.isClosing = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-backdrop')?.classList).toContain('out');
    expect(compiled.querySelector('.modal-content')?.classList).toContain('out');
  });

  it('should add .fullscreen class when fullscreen', () => {
    component.open = true;
    component.isFullscreen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-content')?.classList).toContain('fullscreen');
  });

  it('should display projected content', () => {
    @Component({
      template: `<app-dialog [open]="true"><div class="test-content">Contenu projeté</div></app-dialog>`,
      standalone: true,
      imports: [DialogComponent]
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    const compiled = hostFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.test-content')?.textContent).toContain('Contenu projeté');
  });
});