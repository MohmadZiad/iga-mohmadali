import { Component, computed, inject } from '@angular/core';
import { CxConnectInstanceService } from '../../../../data/api-services/cx-connect-instance.service';

@Component({
    selector: 'app-cx-agents-connect-instance-details',
    imports: [],
    templateUrl: './cx-agents-connect-instance-details.component.html',
    styleUrl: './cx-agents-connect-instance-details.component.scss',
})
export class CxAgentsConnectInstanceDetailsComponent {
    private cxConnectInstanceService = inject(CxConnectInstanceService);
    instanceDetails = computed(() => this.cxConnectInstanceService.getInstanceDetails());
}
