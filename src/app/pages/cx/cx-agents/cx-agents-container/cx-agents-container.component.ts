import { Component } from '@angular/core';
import { CxAgentsHeaderComponent } from '../cx-agents-header/cx-agents-header.component';
import { CxAgentsConnectInstanceListComponent } from '../cx-agents-connect-instance-list/cx-agents-connect-instance-list.component';

@Component({
    selector: 'app-cx-agents-container',
    imports: [CxAgentsHeaderComponent, CxAgentsConnectInstanceListComponent],
    templateUrl: './cx-agents-container.component.html',
    styleUrl: './cx-agents-container.component.scss',
})
export class CxAgentsContainerComponent {}
