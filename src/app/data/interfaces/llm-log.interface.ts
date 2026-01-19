import { DateTime } from 'luxon';

export interface LlmLogDb {
    llm_log_id: string;
    llm_structure_id: string;
    session_id: string;
    question: string;
    answer: string;
    sources?: string[];
    created_at: string;
    updated_at: string;
}

export interface LlmLog {
    llmLogId: string;
    llmStructureId: string;
    sessionId: string;
    question: string;
    answer: string;
    sources: string[];
    createdAt: DateTime;
    updatedAt: DateTime;
}
