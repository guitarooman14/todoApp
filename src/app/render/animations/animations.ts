import {animate, state, style, transition, trigger} from '@angular/animations';

export const visibilityChangedTransition =
  trigger('visibilityChanged', [
    state('true', style({ opacity: 1 })),
    state('false', style({ opacity: 0 })),
    transition('1 => 0', animate('300ms')),
    transition('0 => 1', animate('900ms'))
  ]);

export const fadeInAnimation =
  // the fade-in/fade-out animation.
  trigger('fadeInAnimation', [

    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({ opacity: 1 })),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [
      style({ opacity: 0 }),
      animate(600)
    ]),

    // fade out when destroyed. this could also be written as transition('void => *')
    transition(':leave',
      animate(0, style({ opacity: 0 })))
  ]);
