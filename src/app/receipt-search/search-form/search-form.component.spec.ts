import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  let formBuilder: FormBuilder;
  let formGroup: FormGroup;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      storeId: [null],
      receiptNo: [''],
      fromDate: [''],
      toDate: [''],
    });

    component.form = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
