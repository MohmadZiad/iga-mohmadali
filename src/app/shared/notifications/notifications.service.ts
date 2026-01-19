import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    constructor(private snackBar: MatSnackBar) {}

    show(message: string) {
        this.snackBar.open(message, 'X', { verticalPosition: 'top' });
    }

    close() {
        this.snackBar.dismiss();
    }
}
