import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemPreviewComponent } from './item-preview';

describe('ItemPreviewComponent', () => {
  let component: ItemPreviewComponent;
  let fixture: ComponentFixture<ItemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPreviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title in uppercase', () => {
    component.title = 'test title';
    fixture.detectChanges();
    const titleElem = fixture.debugElement.query(By.css('b'));
    expect(titleElem.nativeElement.textContent).toBe('TEST TITLE');
  });

  it('should display the content if provided', () => {
    component.content = 'Ceci est un <i>test</i>';
    fixture.detectChanges();
    const contentElem = fixture.debugElement.query(By.css('.content span'));
    expect(contentElem.nativeElement.innerHTML).toContain('Ceci est un <i>test</i>');
  });

  it('should not display the content span if content is empty', () => {
    component.content = '';
    fixture.detectChanges();
    const contentElem = fixture.debugElement.query(By.css('.content span'));
    expect(contentElem).toBeNull();
  });

  it('should display the image if imageUrl is set', () => {
    component.picture = { url: 'http://example.com/image.png' } as any;
    component.ngOnChanges({ picture: true } as any);
    fixture.detectChanges();
    const imgElem = fixture.debugElement.query(By.css('img.picture'));
    expect(imgElem).not.toBeNull();
    expect(imgElem.nativeElement.src).toBe('http://example.com/image.png');
  });

  it('should not display the image if imageUrl is not set', () => {
    component.picture = null;
    component.ngOnChanges({ picture: true } as any);
    fixture.detectChanges();
    const imgElem = fixture.debugElement.query(By.css('img.picture'));
    expect(imgElem).toBeNull();
  });

  it('should set imageUrl from File and revoke object URL on destroy', () => {
    const file = new File(['foo'], 'foo.png', { type: 'image/png' });
    spyOn(URL, 'createObjectURL').and.returnValue('blob:http://test/image');
    spyOn(URL, 'revokeObjectURL');
    component.picture = file;
    component.ngOnChanges({ picture: true } as any);
    fixture.detectChanges();
    expect(component.imageUrl).toBe('blob:http://test/image');
    component.ngOnDestroy();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://test/image');
  });

	it('should apply correct styles to image and content', () => {
		component.picture = { url: 'http://example.com/image.png' } as any;
		component.color = '#123456';
		component.size = 80;
		component.ngOnChanges({ picture: true } as any);
		fixture.detectChanges();

		const imgElem = fixture.debugElement.query(By.css('img.picture')).nativeElement as HTMLImageElement;
		const contentElem = fixture.debugElement.query(By.css('.content')).nativeElement as HTMLElement;
		const imgStyles = getComputedStyle(imgElem);
		const contentStyles = getComputedStyle(contentElem);

		expect(imgStyles.borderColor).toBe('rgb(18, 52, 86)');
		expect(imgStyles.width).toBe('80px');
		expect(imgStyles.height).toBe('80px');
		expect(contentStyles.borderColor).toBe('rgb(18, 52, 86)');
		expect(contentStyles.marginLeft).toBe('-40px');
		expect(contentStyles.paddingLeft).toBe('53.3333px');
	});
});