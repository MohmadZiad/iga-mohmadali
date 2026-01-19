import { DateTime } from 'luxon';

export interface LlmStructureSharedTokenDb {
    llm_structure_shared_token_id: string;
    llm_structure_id: string;
    description: string;
    shared_token: string;
    created_at: string;
    updated_at: string;
}

export interface LlmStructureSharedToken {
    llmStructureSharedTokenId?: string;
    llmStructureId?: string;
    description: string;
    sharedToken: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
}
