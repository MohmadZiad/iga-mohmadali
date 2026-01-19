import { Component, inject, OnInit, signal } from '@angular/core';
import { CxChannelService } from '../../../../data/api-services/cx-channel.service';
import { CxChannelList } from '../../../../data/interfaces/cx-channel.interface';
import { getChannelLabelMap } from '../../../../shared/utils/cx.utils';

@Component({
    selector: 'app-cx-channels-list',
    imports: [],
    templateUrl: './cx-channels-list.component.html',
    styleUrl: './cx-channels-list.component.scss',
})
export class CxChannelsListComponent implements OnInit {
    private channelService = inject(CxChannelService);
    channelList = signal<CxChannelList | null>(null);

    get channelLabelMap() {
        return getChannelLabelMap();
    }

    ngOnInit() {
        this.channelService.getChannelList().subscribe({
            next: (data) => this.channelList.set(data),
            error: (error) => console.log(error),
        });
    }
}
