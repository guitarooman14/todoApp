import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainViewComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
  }
}
