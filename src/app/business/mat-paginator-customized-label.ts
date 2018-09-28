import {MatPaginatorIntl} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

export class MatPaginatorIntlCro extends MatPaginatorIntl {
  translate: TranslateService;
  itemsPerPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  onLabel: string;

  public getRangeLabel = (page, pageSize, length): string => {
    if (length === 0 || pageSize === 0) {
      return '0 ' + this.onLabel + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + this.onLabel + ' ' + length;
  }

  public injectTranslateService(translate: TranslateService) {
    this.translate = translate;
    this.translateLabels();

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translate.onDefaultLangChange.subscribe(() => {
      this.translateLabels();
    });
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('PaginatorItemsPerPageLabel');
    this.nextPageLabel = this.translate.instant('PaginatorNextPageLabel');
    this.previousPageLabel = this.translate.instant('PaginatorPreviousPageLabel');
    this.onLabel = this.translate.instant('PaginatorOnLabel');
    // refresh the label
    this.changes.next();
  }
}
