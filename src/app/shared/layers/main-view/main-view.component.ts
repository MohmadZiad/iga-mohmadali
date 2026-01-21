import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../../data/api-services/user/user.service';
import { NgClass } from '@angular/common';
import { switchMap } from 'rxjs';
import { AccountService } from '../../../data/api-services/account/account.service';

@Component({
    selector: 'app-main-view',
    imports: [RouterModule, SidebarComponent, NgClass],
    templateUrl: './main-view.component.html',
    styleUrl: './main-view.component.scss',
})
export class MainViewComponent implements OnInit {
    userService = inject(UserService);
    accountService = inject(AccountService);
    isSubMenuOpened$ = signal<boolean>(false);
    isLoading = false;

    ngOnInit() {
        this.isLoading = true;
        this.userService
            .get()
            .pipe(switchMap(() => this.accountService.getList()))
            .subscribe(() => {
                this.isLoading = false;
            });
    }
}
