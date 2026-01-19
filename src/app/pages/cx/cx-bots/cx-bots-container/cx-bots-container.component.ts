import { Component } from '@angular/core';
import { CxBotsHeaderComponent } from '../cx-bots-header/cx-bots-header.component';
import { CxBotsListComponent } from '../cx-bots-list/cx-bots-list.component';

@Component({
    selector: 'app-cx-bots-container',
    imports: [CxBotsHeaderComponent, CxBotsListComponent],
    templateUrl: './cx-bots-container.component.html',
    styleUrl: './cx-bots-container.component.scss',
})
export class CxBotsContainerComponent {}
