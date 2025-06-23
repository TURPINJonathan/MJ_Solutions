import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { SwitchModeComponent } from './switch-mode';

describe('SwitchModeComponent', () => {
    let component: SwitchModeComponent;
    let fixture: ComponentFixture<SwitchModeComponent>;
    let renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SwitchModeComponent]
        });
        fixture = TestBed.createComponent(SwitchModeComponent);
        component = fixture.componentInstance;
        renderer = fixture.debugElement.injector.get(Renderer2);

        spyOn(renderer, 'addClass').and.callThrough();
        spyOn(renderer, 'removeClass').and.callThrough();

        localStorage.removeItem('theme');
        document.body.classList.remove('dark');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set isDark to true if body has dark class', () => {
            document.body.classList.add('dark');
            component.ngOnInit();
            expect(component.isDark).toBeTrue();
            document.body.classList.remove('dark');
        });

        it('should set isDark to false if body does not have dark class', () => {
            document.body.classList.remove('dark');
            component.ngOnInit();
            expect(component.isDark).toBeFalse();
        });
    });

    describe('toggleTheme', () => {
        it('should enable dark mode', () => {
            component.isDark = false;
            component.toggleTheme();
            expect(component.isDark).toBeTrue();
            expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'dark');
            expect(localStorage.getItem('theme')).toBe('dark');
        });

        it('should disable dark mode', () => {
            component.isDark = true;
            component.toggleTheme();
            expect(component.isDark).toBeFalse();
            expect(renderer.removeClass).toHaveBeenCalledWith(document.body, 'dark');
            expect(localStorage.getItem('theme')).toBe('light');
        });
    });

    it('should toggle theme twice and restore initial state', () => {
        const initial = component.isDark;
        component.toggleTheme();
        const afterFirst = component.isDark;
        component.toggleTheme();
        expect(component.isDark).toBe(initial);
        expect(afterFirst).not.toBe(initial);
    });

    it('should update checkbox state in template when toggling', () => {
        fixture.detectChanges();
        const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('#toggle_checkbox');
        expect(checkbox.checked).toBe(component.isDark);

        component.toggleTheme();
        fixture.detectChanges();
        expect(checkbox.checked).toBe(component.isDark);
    });

    it('should call toggleTheme when checkbox is changed', () => {
        spyOn(component, 'toggleTheme').and.callThrough();
        fixture.detectChanges();
        const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('#toggle_checkbox');
        checkbox.dispatchEvent(new Event('change'));
        expect(component.toggleTheme).toHaveBeenCalled();
    });

    it('should persist theme in localStorage after toggle', () => {
        component.isDark = false;
        component.toggleTheme();
        expect(localStorage.getItem('theme')).toBe('dark');
        component.toggleTheme();
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should not throw if toggleTheme called multiple times', () => {
        expect(() => {
            for (let i = 0; i < 10; i++) {
                component.toggleTheme();
            }
        }).not.toThrow();
    });
});