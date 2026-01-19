import { Component, inject, OnInit, signal } from '@angular/core';
import { CxBotList } from '../../../../data/interfaces/cx-bot.interface';
import { CxBotService } from '../../../../data/api-services/cx-bot.service';

@Component({
    selector: 'app-cx-bots-list',
    imports: [],
    templateUrl: './cx-bots-list.component.html',
    styleUrl: './cx-bots-list.component.scss',
})
export class CxBotsListComponent implements OnInit {
    private readonly cxBotService = inject(CxBotService);
    botList = signal<CxBotList>([]);

    ngOnInit(): void {
        this.cxBotService.getList().subscribe({
            next: (data) => this.botList.set(data),
            error: (err) => console.error(err),
        });
    }
}
