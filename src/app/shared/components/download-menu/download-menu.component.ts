import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-download-menu',
    imports: [MatIconModule, MatMenuModule, MatButtonModule],
    templateUrl: './download-menu.component.html',
    styleUrl: './download-menu.component.scss',
})
export class DownloadMenuComponent {
    formats = input<string[]>(['csv']);
    selectedFormat = output<string>();

    downloadFormat(format: string) {
        this.selectedFormat.emit(format);
    }
}
