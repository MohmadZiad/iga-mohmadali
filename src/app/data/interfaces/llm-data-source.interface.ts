import { DateTime } from 'luxon';

export interface LlmDataSourceDb {
    llm_data_source_id: string;
    name: string;
    chunking_strategy: string;
    chunk_size: number;
    embeddings_model: string;
    s3_folder: string;
    data_source_id: string;
    knowledge_base_id: string;
    opensearch_index: string;
    ingestion_job_id: string;

    created_at: string;
}

export interface LlmDataSource {
    llmDataSourceId?: string;
    name: string;
    chunkingStrategy: string;
    chunkSize: number;
    embeddingModels: string;
    s3Folder: string;
    dataSourceId?: string;
    knowledgeBaseId?: string;
    opensearchIndex?: string;
    ingestionJobId?: string;

    createdAt?: DateTime;

    syncStatus?: string;
    warnings: string[];
}

export interface LlmDataSourceSyncStatus {
    ingestionJob: LlmDataSourceIngestionJob;
}

export interface LlmDataSourceIngestionJob {
    ingestionJobId: string;
    status: string;
    failureReasons: string[];
}
