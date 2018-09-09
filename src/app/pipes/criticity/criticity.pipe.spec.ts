import {CriticityPipe} from './criticity.pipe';
import {TestBed} from '@angular/core/testing';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpLoaderFactory} from '../../app.module';
import {MatPaginatorIntlCro} from '../../business/mat-paginator-customized-label';
import {MatPaginatorIntl} from '@angular/material';
import {Criticity} from '../../model/i-todolist-model';

describe('CriticityPipe', () => {
  let pipe: CriticityPipe;
  let translateService: TranslateService;
  let translateSubscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          },
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        {
          provide: MatPaginatorIntl,
          useFactory: (translate) => {
            const service = new MatPaginatorIntlCro();
            service.injectTranslateService(translate);
            return service;
          },
          deps: [TranslateService]
        }
      ],
    });
  });

  beforeEach((done) => {
    translateService = TestBed.get(TranslateService);
    translateSubscription = translateService.use('fr').subscribe(_ => {
      done();
    });
    pipe = new CriticityPipe(translateService);
  });

  afterEach(() => {
    if (translateSubscription) {
      translateSubscription.unsubscribe();
    }
  });

  it('getting translation for Low criticity', () => {
    spyOn(translateService, 'instant').and.callFake(() => {
      return 'low';
    });
    const resultat: string = pipe.transform(Criticity.LOW);
    expect(resultat).not.toBeNull();
    expect(resultat).toEqual('low');
  });

  it('getting translation for Normal criticity', () => {
    spyOn(translateService, 'instant').and.callFake(() => {
      return 'normal';
    });
    const resultat: string = pipe.transform(Criticity.NORMAL);
    expect(resultat).not.toBeNull();
    expect(resultat).toEqual('normal');
  });

  it('getting translation for High criticity', () => {
    spyOn(translateService, 'instant').and.callFake(() => {
      return 'high';
    });
    const resultat: string = pipe.transform(Criticity.HIGH);
    expect(resultat).not.toBeNull();
    expect(resultat).toEqual('high');
  });

  it('getting translation for Urgent criticity', () => {
    spyOn(translateService, 'instant').and.callFake(() => {
      return 'immediately';
    });
    const resultat: string = pipe.transform(Criticity.URGENT);
    expect(resultat).not.toBeNull();
    expect(resultat).toEqual('immediately');
  });
});
