import {animate, state, style, transition, trigger} from '@angular/animations';

export const fadeInTransition =
  trigger('visibilityChanged', [
    state('true', style({opacity: 1})),
    state('false', style({opacity: 0})),
    transition('1 => 0', animate('300ms')),
    transition('0 => 1', animate('900ms'))
  ]);
