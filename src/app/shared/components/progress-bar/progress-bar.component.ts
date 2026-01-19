import { Component, input } from '@angular/core';

type TypeProgressBar = 'vertical' | 'horizontal';

@Component({
    selector: 'app-progress-bar',
    imports: [],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
    progress = input<number>(0);
    color = input<string>('');
    type = input<TypeProgressBar>('horizontal');
}
