import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Footer } from './footer';
import { AuthService } from '#BO/services/auth/auth.service';
import { ToastUtils } from '#BO/utils/toastUtils';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

describe('Footer', () => {
    let component: Footer;
    let fixture: ComponentFixture<Footer>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let toastSpy: jasmine.SpyObj<ToastUtils>;
    let routerSpy: jasmine.SpyObj<Router>;
    let translateSpy: jasmine.SpyObj<TranslateService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
        toastSpy = jasmine.createSpyObj('ToastUtils', ['success', 'error']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

        await TestBed.configureTestingModule({
            imports: [Footer],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastUtils, useValue: toastSpy },
                { provide: Router, useValue: routerSpy },
                { provide: TranslateService, useValue: translateSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Footer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the current year and company name', () => {
        const span = fixture.debugElement.query(By.css('.footer-left span'));
        expect(span.nativeElement.textContent).toContain(new Date().getFullYear().toString());
        expect(span.nativeElement.textContent).toContain('MJ Solutions');
    });

    it('should call logout on button click', () => {
        spyOn(component, 'logout');
        const btn = fixture.debugElement.query(By.css('.logout-btn'));
        btn.nativeElement.click();
        expect(component.logout).toHaveBeenCalled();
    });

    it('should call AuthService.logout and clear tokens on successful logout', fakeAsync(() => {
		localStorage.setItem('token', 'abc');
        localStorage.setItem('refreshToken', 'refresh');
        authServiceSpy.logout.and.returnValue(of({}));
        translateSpy.instant.and.callFake((key: string) => key);

        component.logout();
        tick();

        expect(authServiceSpy.logout).toHaveBeenCalledWith('refresh');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(toastSpy.success).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show error toast on logout error', fakeAsync(() => {
        authServiceSpy.logout.and.returnValue(throwError(() => new Error('fail')));
        translateSpy.instant.and.callFake((key: string) => key);

        component.logout();
        tick();

        expect(toastSpy.error).toHaveBeenCalled();
    }));

    it('should render language switcher and switch mode components', () => {
        const lang = fixture.debugElement.query(By.css('app-language-switcher'));
        const switchMode = fixture.debugElement.query(By.css('app-switch-mode'));
        expect(lang).toBeTruthy();
        expect(switchMode).toBeTruthy();
    });
});