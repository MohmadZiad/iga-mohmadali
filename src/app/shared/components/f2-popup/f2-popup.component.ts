import { Component, model } from '@angular/core';

@Component({
    selector: 'app-f2-popup',
    imports: [],
    templateUrl: './f2-popup.component.html',
    styleUrl: './f2-popup.component.scss',
})
export class F2PopupComponent {
    open = model(false);

    hide(): void {
        this.open.set(false);
    }
}
