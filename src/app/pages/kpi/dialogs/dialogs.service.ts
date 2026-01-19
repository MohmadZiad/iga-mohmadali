import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrillDownDialogComponent, DrillDownDialogData } from './drill-down-dialog/drill-down-dialog.component';
import { MissedServicesDialogComponent, MissedServicesItem } from './missed-services-dialog/missed-services-dialog.component';
import { AdminCreateServiceComponent, AdminCreateServiceDialogData } from './admin-create-service/admin-create-service.component';

@Injectable({
    providedIn: 'root',
})
export class DialogsService {
    dialog = new MatDialog();

    openDrillDownDialog(data: DrillDownDialogData) {
        return this.dialog.open(DrillDownDialogComponent, {
            minWidth: '90vw',
            maxWidth: '90vw',
            maxHeight: '95vh',
            minHeight: '25vh',
            disableClose: false,
            data: data,
        });
    }

    openMissedServiceDialog(listMissedServices: MissedServicesItem[], comment = '') {
        return this.dialog.open(MissedServicesDialogComponent, {
            width: '520px',
            maxHeight: '700px',
            disableClose: false,
            data: {
                listMissedServices: listMissedServices,
                comment: comment,
            },
        });
    }

    openAdminCreateServiceDialog(data: AdminCreateServiceDialogData) {
        return this.dialog.open(AdminCreateServiceComponent, {
            width: '520px',
            maxHeight: '700px',
            disableClose: false,
            data,
        });
    }
}
