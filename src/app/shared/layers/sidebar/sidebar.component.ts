import { Component, EventEmitter, inject, Output, signal, OnInit, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../../data/interfaces/menu-item.interface';
import { UserService } from '../../../data/api-services/user/user.service';
import { NgClass } from '@angular/common';
import { APP_VERSION, FEATURES_FLAGS } from '../../../../environments/environments';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidebar',
    imports: [MatListModule, RouterLink, RouterLinkActive, MatMenuModule, NgClass, MatButtonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Output() subMenuOpened = new EventEmitter<boolean>();

    authService = inject(AuthService);
    userService = inject(UserService);
    router = inject(Router);
    unsubscriber = new Subject();

    isSubMenuOpened$ = signal<boolean>(false);
    subMenuHeader$ = signal<string>('');
    subMenuItems$ = signal<MenuItem[]>([]);

    appVersion = APP_VERSION;

    menuItems: MenuItem[] = [
        {
            condition: FEATURES_FLAGS.dashboard,
            path: '/kpi',
            name: 'Reports',
            icon: '/assets/icons/sidebar/analytics.svg',
            selectedIcon: '/assets/icons/sidebar/analytics-selected.svg',
            children: [
                {
                    condition: this.userService.isRootAccountUser,
                    path: '/kpi/dashboard',
                    name: 'PMO View',
                    icon: '/assets/icons/sidebar/kpi/pmo-view.svg',
                    selectedIcon: '/assets/icons/sidebar/kpi/pmo-view-selected.svg',
                },
                {
                    path: '/kpi/entity',
                    name: 'Entity View',
                    icon: '/assets/icons/sidebar/kpi/entity-view.svg',
                    selectedIcon: '/assets/icons/sidebar/kpi/entity-view-selected.svg',
                },
                {
                    path: '/kpi/upload',
                    name: 'Upload',
                    icon: '/assets/icons/sidebar/kpi/upload-kpi.svg',
                    selectedIcon: '/assets/icons/sidebar/kpi/upload-kpi-selected.svg',
                },
                {
                    condition: FEATURES_FLAGS.pm,
                    path: '/pm/create-project',
                    name: 'Project Management',
                    icon: '/assets/icons/sidebar/kpi/project-management.svg',
                    selectedIcon: '/assets/icons/sidebar/kpi/project-management-selected.svg',
                },
                {
                    condition: this.userService.isRootAccountUser,
                    path: '/kpi/admin/service-codes',
                    name: 'Admin Services',
                    icon: '/assets/icons/sidebar/settings.svg',
                    selectedIcon: '/assets/icons/sidebar/settings-selected.svg',
                },
            ],
        },
        {
            condition: FEATURES_FLAGS.llm,
            path: '/llm',
            name: 'LLM',
            icon: '/assets/icons/sidebar/llm.svg',
            selectedIcon: '/assets/icons/sidebar/llm-selected.svg',
            children: [
                {
                    path: '/llm/structures',
                    name: 'Structures',
                    icon: '/assets/icons/sidebar/llm-structure.svg',
                    selectedIcon: '/assets/icons/sidebar/llm-structure-selected.svg',
                },
                {
                    path: '/llm/data-sources',
                    name: 'Data Sources',
                    icon: '/assets/icons/sidebar/llm-data-source.svg',
                    selectedIcon: '/assets/icons/sidebar/llm-data-source-selected.svg',
                },
            ],
        },
        {
            condition: FEATURES_FLAGS.cx,
            path: '/cx',
            name: 'CX',
            icon: '/assets/icons/sidebar/chats.svg',
            selectedIcon: '/assets/icons/sidebar/chats-selected.svg',
            children: [
                {
                    path: '/cx/chats',
                    name: 'Chat',
                    icon: '/assets/icons/sidebar/profile-people.svg',
                    selectedIcon: '/assets/icons/sidebar/profile-people-selected.svg',
                },
                {
                    path: '/cx/bots',
                    name: 'Bot',
                    icon: '/assets/icons/sidebar/chats-chatbot.svg',
                    selectedIcon: '/assets/icons/sidebar/chats-chatbot-selected.svg',
                },
                {
                    path: '/cx/agents',
                    name: 'Agent',
                    icon: '/assets/icons/sidebar/chats-agent.svg',
                    selectedIcon: '/assets/icons/sidebar/chats-agent-selected.svg',
                },
                {
                    path: '/cx/ai-agents',
                    name: 'AI Agent',
                    icon: '/assets/icons/sidebar/chats-chatbot.svg',
                    selectedIcon: '/assets/icons/sidebar/chats-chatbot-selected.svg',
                },
                {
                    path: '/cx/channels',
                    name: 'Channel',
                    icon: '/assets/icons/sidebar/channels.svg',
                    selectedIcon: '/assets/icons/sidebar/channels-selected.svg',
                },
                {
                    path: '/cx/providers',
                    name: 'Provider',
                    icon: '/assets/icons/sidebar/chats-agent.svg',
                    selectedIcon: '/assets/icons/sidebar/chats-agent-selected.svg',
                },
            ],
        },
        {
            condition: FEATURES_FLAGS.settings,
            path: '/settings',
            name: 'Settings',
            icon: '/assets/icons/sidebar/settings.svg',
            selectedIcon: '/assets/icons/sidebar/settings-selected.svg',
            children: [
                {
                    path: '/settings/profile',
                    name: 'My Profile',
                    icon: '/assets/icons/sidebar/profile-people.svg',
                    selectedIcon: '/assets/icons/sidebar/profile-people-selected.svg',
                },
                {
                    condition: this.userService.isRootAccountUser && this.userService.authUser?.isAdmin,
                    path: '/settings/users',
                    name: 'Users Management',
                    icon: '/assets/icons/sidebar/users.svg',
                    selectedIcon: '/assets/icons/sidebar/users-selected.svg',
                },
                {
                    condition: this.userService.isRootAccountUser && this.userService.authUser?.isAdmin,
                    path: '/settings/roles',
                    name: 'Roles & Permissions',
                    icon: '/assets/icons/sidebar/roles.svg',
                    selectedIcon: '/assets/icons/sidebar/roles-selected.svg',
                },
            ],
        },
    ] as MenuItem[];

    getUser() {
        return this.userService.authUser;
    }

    ngOnInit() {
        // open sub-menu for active URL
        this.openSubMenu(this.router.url);

        // subscribe on URL changes to open/update sub-menu
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.unsubscriber)
            )
            .subscribe((event: NavigationEnd) => {
                document.getElementsByClassName('main-content')[0]?.scrollTo(0, 0);
                this.openSubMenu(event.url);
            });
    }

    openSubMenu(url: string | null) {
        if (!url) {
            return;
        }
        // Check if URL is for Project Management (pm) and find Reports menuItem
        let activeMenuItem = this.menuItems.find((menuItem) => url.includes(menuItem.path));
        if (url.startsWith('/pm') && !activeMenuItem) {
            activeMenuItem = this.menuItems.find((menuItem) => menuItem.path === '/kpi');
        }
        this.subMenuHeader$.set(activeMenuItem?.name || '');
        const subMenuItems = activeMenuItem?.children || [];
        this.subMenuItems$.set(subMenuItems);
        if (subMenuItems.length) {
            this.isSubMenuOpened$.set(true);
            this.subMenuOpened.emit(true);
        } else {
            this.isSubMenuOpened$.set(false);
            this.subMenuOpened.emit(false);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    unsubscribe() {
        this.unsubscriber.next('');
        this.unsubscriber.complete();
    }

    logout() {
        this.authService.logout();
    }

    changeDisplaySubMenu() {
        this.isSubMenuOpened$.update((value) => !value);
        this.subMenuOpened.emit(this.isSubMenuOpened$());
    }
}
