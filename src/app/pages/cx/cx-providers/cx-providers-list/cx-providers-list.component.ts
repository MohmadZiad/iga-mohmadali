import { Component, inject, OnInit, signal } from '@angular/core';
import { CxProviderService } from '../../../../data/api-services/cx-provider.service';
import { CxProviderList } from '../../../../data/interfaces/cx-provider.interface';

@Component({
    selector: 'app-cx-providers-list',
    imports: [],
    templateUrl: './cx-providers-list.component.html',
    styleUrl: './cx-providers-list.component.scss',
})
export class CxProvidersListComponent implements OnInit {
    private cxProviderService = inject(CxProviderService);
    providers = signal<CxProviderList>([]);

    ngOnInit(): void {
        this.cxProviderService.getProviderList().subscribe({
            next: (data) => this.providers.set(data),
            error: (err) => console.log(err),
        });
    }
}
