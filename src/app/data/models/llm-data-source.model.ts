import { LlmDataSource, LlmDataSourceDb } from '../interfaces/llm-data-source.interface';
import { DateTime } from 'luxon';

export class LlmDataSourceModel implements LlmDataSource {
    llmDataSourceId?: string;
    name: string;
    chunkSize: number;
    chunkingStrategy: string;
    embeddingModels: string;
    s3Folder: string;
    dataSourceId?: string;
    ingestionJobId?: string;
    knowledgeBaseId?: string;
    opensearchIndex?: string;

    createdAt?: DateTime;

    syncStatus?: string;
    warnings: string[];

    constructor(data: Partial<LlmDataSource> = {}) {
        this.llmDataSourceId = data.llmDataSourceId;
        this.name = data.name!;
        this.chunkSize = data.chunkSize!;
        this.chunkingStrategy = data.chunkingStrategy!;
        this.embeddingModels = data.embeddingModels!;
        this.s3Folder = data.s3Folder!;
        this.dataSourceId = data.dataSourceId!;
        this.ingestionJobId = data.ingestionJobId!;
        this.knowledgeBaseId = data.knowledgeBaseId!;
        this.opensearchIndex = data.opensearchIndex!;

        this.createdAt = data.createdAt!;

        this.syncStatus = data.syncStatus!;
        this.warnings = data.warnings!;
    }

    setSyncStatus(syncStatus: string) {
        this.syncStatus = syncStatus;
    }

    static parseDb(data: LlmDataSourceDb): LlmDataSource {
        return new LlmDataSourceModel({
            llmDataSourceId: data.llm_data_source_id,
            name: data.name,
            chunkSize: data.chunk_size,
            chunkingStrategy: data.chunking_strategy,
            embeddingModels: data.embeddings_model,
            s3Folder: data.s3_folder,
            dataSourceId: data.data_source_id,
            ingestionJobId: data.ingestion_job_id,
            knowledgeBaseId: data.knowledge_base_id,
            opensearchIndex: data.opensearch_index,

            createdAt: DateTime.fromISO(data.created_at),
        });
    }
}
