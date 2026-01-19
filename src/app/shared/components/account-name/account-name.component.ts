import { Component, computed, input } from '@angular/core';
import { AccountItem } from '../../../data/api-services/account/account.service';

@Component({
    selector: 'app-account-name',
    imports: [],
    templateUrl: './account-name.component.html',
    styleUrl: './account-name.component.scss',
})
export class AccountNameComponent {
    accountItem = input<AccountItem | undefined>(undefined);

    displayingData = computed(() => {
        return {
            accountName: this.accountItem()?.accountName || 'Unknown',
            logo: this.accountItem()?.logo || 'assets/icons/logo-icon.svg',
        };
    });
}
