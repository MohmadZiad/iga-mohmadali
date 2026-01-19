import { Component } from '@angular/core';
import { CxProvidersHeaderComponent } from '../cx-providers-header/cx-providers-header.component';
import { CxProvidersListComponent } from '../cx-providers-list/cx-providers-list.component';

@Component({
    selector: 'app-cx-providers-container',
    imports: [CxProvidersHeaderComponent, CxProvidersListComponent],
    templateUrl: './cx-providers-container.component.html',
    styleUrl: './cx-providers-container.component.scss',
})
export class CxProvidersContainerComponent {}
