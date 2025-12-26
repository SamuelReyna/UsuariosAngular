import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarEmail } from './enviar-email';

describe('EnviarEmail', () => {
  let component: EnviarEmail;
  let fixture: ComponentFixture<EnviarEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
