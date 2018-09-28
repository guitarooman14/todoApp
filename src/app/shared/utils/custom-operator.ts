import {OperatorFunction} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AppState} from '@StoreConfig';

export const filterEmpty: () => OperatorFunction<any, any> = () => filter((v: AppState) => {
  let res = false;
  if (v != null && v.tasks.data != null) {
    res = true;
  }
  return res;
});
