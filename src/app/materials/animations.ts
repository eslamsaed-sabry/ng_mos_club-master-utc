
import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'opacity': '1', 'visibility': 'visible'
        }),{params: {numberOfItems: 1}}),
        state('out', style({
            'height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('200ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('300ms ease-in-out', style({
                'height': '0px'
            })),
            animate('400ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('300ms ease-in-out', style({
                'height': '{{numberOfItems}}px'
            })),
            animate('200ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]
