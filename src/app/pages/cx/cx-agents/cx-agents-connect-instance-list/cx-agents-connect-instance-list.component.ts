import { Component, inject, OnInit, signal } from '@angular/core';
import { CxConnectInstanceService } from '../../../../data/api-services/cx-connect-instance.service';
import { CxConnectInstance, CxConnectInstanceList } from '../../../../data/interfaces/cx-connect-instance.interface';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cx-agents-connect-instance-list',
    imports: [DatePipe],
    templateUrl: './cx-agents-connect-instance-list.component.html',
    styleUrl: './cx-agents-connect-instance-list.component.scss',
})
export class CxAgentsConnectInstanceListComponent implements OnInit {
    private router = inject(Router);
    connectInstanceList = signal<CxConnectInstanceList>([]);
    private connectInstanceService = inject(CxConnectInstanceService);

    ngOnInit(): void {
        this.connectInstanceService.getList().subscribe({
            next: (data) => this.connectInstanceList.set(data),
            error: (error) => console.error(error),
        });
    }

    onInstanceClick(instance: CxConnectInstance) {
        this.connectInstanceService.setInstanceDetails(instance);
        this.router.navigate([`cx/agents/${instance.instanceId}/details`]);
    }
}
