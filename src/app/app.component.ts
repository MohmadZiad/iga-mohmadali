import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingIndicatorComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'new-engine-ui';
}
