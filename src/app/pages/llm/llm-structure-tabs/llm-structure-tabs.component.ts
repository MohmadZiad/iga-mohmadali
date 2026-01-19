import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsBarComponent } from '../../../shared/components/tabs-bar/tabs-bar.component';

@Component({
    selector: 'app-llm-structure-tabs',
    imports: [RouterOutlet, TabsBarComponent],
    templateUrl: './llm-structure-tabs.component.html',
    styleUrl: './llm-structure-tabs.component.scss',
})
export class LlmStructureTabsComponent {
    tabs = [
        { label: 'Details', route: 'details' },
        { label: 'Demo', route: 'demo' },
        { label: 'Logs', route: 'logs' },
        { label: 'Shared Tokens', route: 'shared-tokens' },
    ];
}
