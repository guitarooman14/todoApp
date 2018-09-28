import {Pipe, PipeTransform} from '@angular/core';
import {Criticity} from '@Models/i-todolist-model';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'criticity',
  pure: false // impure pipe, update value when we change language
})
export class CriticityPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(value: any, args?: any): string {
    let resultat: string;
    switch (value as Criticity) {
      case Criticity.URGENT:
        resultat = this.translateService.instant('UrgentCriticity');
        break;
      case Criticity.HIGH:
        resultat = this.translateService.instant('HighCriticty');
        break;
      case Criticity.NORMAL:
        resultat = this.translateService.instant('NormalCriticty');
        break;
      case Criticity.LOW:
        resultat = this.translateService.instant('LowCriticty');
        break;
    }
    return resultat;
  }
}
