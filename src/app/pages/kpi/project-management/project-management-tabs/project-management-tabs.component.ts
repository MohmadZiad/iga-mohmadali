import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsBarComponent } from '../../../../shared/components/tabs-bar/tabs-bar.component';

@Component({
    selector: 'app-project-management-tabs',
    imports: [RouterOutlet, TabsBarComponent],
    templateUrl: './project-management-tabs.component.html',
    styleUrl: './project-management-tabs.component.scss',
})
export class ProjectManagementTabsComponent {
    tabs = signal([
        { label: 'Create Project', route: 'create-project' },
        // { label: 'Project List', route: 'project-list' },
        { label: 'Add Services', route: 'add-services' },
        { label: 'View Project', route: 'view-project' },
    ]);
}
