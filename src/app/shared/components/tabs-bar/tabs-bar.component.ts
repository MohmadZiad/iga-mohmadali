import { Component, Input } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-tabs-bar',
    imports: [RouterLinkActive, MatTabLink, RouterLink, MatTabNav, MatTabNavPanel],
    templateUrl: './tabs-bar.component.html',
    styleUrl: './tabs-bar.component.scss',
})
export class TabsBarComponent {
    @Input() tabs: { label: string; route: string }[] = [];
}
