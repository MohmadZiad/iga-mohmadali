import { Component } from '@angular/core';
import { CxChannelsHeaderComponent } from '../cx-channels-header/cx-channels-header.component';
import { CxChannelsListComponent } from '../cx-channels-list/cx-channels-list.component';

@Component({
    selector: 'app-cx-channels-container',
    imports: [CxChannelsHeaderComponent, CxChannelsListComponent],
    templateUrl: './cx-channels-container.component.html',
    styleUrl: './cx-channels-container.component.scss',
})
export class CxChannelsContainerComponent {}
