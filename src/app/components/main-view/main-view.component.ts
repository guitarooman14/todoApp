import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscribable, Subscription} from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainViewComponent implements OnInit, OnDestroy {
  private switchLanguageSubscription: Subscription;

  constructor(private translate: TranslateService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    translate.setDefaultLang('fr');
    iconRegistry.addSvgIcon('england', sanitizer.bypassSecurityTrustResourceUrl('assets/img/england.svg'));
    iconRegistry.addSvgIcon('france', sanitizer.bypassSecurityTrustResourceUrl('assets/img/france.svg'));
    iconRegistry.addSvgIcon('translation', sanitizer.bypassSecurityTrustResourceUrl('assets/img/google.svg'));
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.switchLanguageSubscription) {
      this.switchLanguageSubscription.unsubscribe();
    }
  }
}
