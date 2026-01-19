import { Component, computed, input, Input } from '@angular/core';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { hexToRgb } from '../../utils/general.utils';

@Component({
    selector: 'app-circle-progress-bar',
    imports: [MatProgressSpinnerModule],
    templateUrl: './circle-progress-bar.component.html',
    styleUrl: './circle-progress-bar.component.scss',
})
export class CircleProgressBarComponent {
    @Input() mode: ProgressSpinnerMode = 'determinate';
    value = input(50);
    color = input('');

    fillCircleColor = computed(() => {
        return this.color()?.includes('#') ? hexToRgb(this.color(), 0.1) : 'none';
    });

    shadowPortion = computed(() => {
        const LENGTH_CIRCLE = 2 * Math.PI * 45;
        return LENGTH_CIRCLE * (1 - this.value() / 100);
    });
}
