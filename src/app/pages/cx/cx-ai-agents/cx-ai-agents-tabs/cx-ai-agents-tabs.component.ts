import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsBarComponent } from '../../../../shared/components/tabs-bar/tabs-bar.component';

@Component({
    selector: 'app-cx-ai-agents-tabs',
    imports: [RouterOutlet, TabsBarComponent],
    templateUrl: './cx-ai-agents-tabs.component.html',
    styleUrl: './cx-ai-agents-tabs.component.scss',
})
export class CxAiAgentsTabsComponent {
    tabs = signal([
        { label: 'Details', route: 'details' },
        { label: 'Configuration', route: 'configuration' },
        { label: 'Logs', route: 'logs' },
    ]);
}
