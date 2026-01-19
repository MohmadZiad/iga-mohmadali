import { Component, inject } from '@angular/core';
import { LlmDataSourceService } from '../../../data/api-services/llm-data-source.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LlmDataSource } from '../../../data/interfaces/llm-data-source.interface';
import { tap } from 'rxjs';

@Component({
    selector: 'app-llm-data-source-details',
    imports: [AsyncPipe],
    templateUrl: './llm-data-source-details.component.html',
    styleUrl: './llm-data-source-details.component.scss',
})
export class LlmDataSourceDetailsComponent {
    llmDataSourceService = inject(LlmDataSourceService);
    private readonly route = inject(ActivatedRoute);
    router = inject(Router);
    dialog = new MatDialog();
    private _interval?: NodeJS.Timeout;

    llmDataSourceId = this.route.snapshot.paramMap.get('dataSourceId');

    llmDataSource: LlmDataSource | null = null;
    llmDataSource$ = this.llmDataSourceService.get(this.llmDataSourceId!).pipe(
        tap((dataSource) => {
            this.llmDataSource = dataSource;
            if (this.llmDataSource.ingestionJobId) {
                this.llmDataSource.syncStatus = 'CHECKING';
                this._interval = setInterval(() => {
                    void this.getSyncStatus();
                }, 1000);
            }
        })
    );

    goBack() {
        this.router.navigate(['/llm/data-sources']);
    }

    sync() {
        this.llmDataSourceService
            .sync(this.llmDataSource!.dataSourceId!, this.llmDataSource!.knowledgeBaseId!)
            .subscribe((res) => {
                if (res?.ingestionJob?.ingestionJobId) {
                    this.llmDataSource!.ingestionJobId = res.ingestionJob.ingestionJobId;
                    this.llmDataSourceService
                        .updateIngestionJobId(this.llmDataSourceId!, res.ingestionJob.ingestionJobId)
                        .subscribe();
                    this._interval = setInterval(() => {
                        void this.getSyncStatus();
                    }, 1000);
                }
            });
    }

    async getSyncStatus() {
        this.llmDataSourceService
            .getSyncStatus(
                this.llmDataSource!.dataSourceId!,
                this.llmDataSource!.knowledgeBaseId!,
                this.llmDataSource!.ingestionJobId!
            )
            .subscribe({
                next: (res) => {
                    this.llmDataSource!.syncStatus = res.ingestionJob.status;
                    this.llmDataSource!.warnings = res.ingestionJob.failureReasons || [];
                    clearInterval(this._interval);
                    if (!['STARTING', 'IN_PROGRESS'].includes(res.ingestionJob.status)) {
                        clearInterval(this._interval);
                    }
                },
                error: (err) => {
                    console.log('getSyncStatus -> err:', err);
                    clearInterval(this._interval);
                },
                complete: () => {
                    console.log('getSyncStatus -> completed');
                },
            });
    }
}
