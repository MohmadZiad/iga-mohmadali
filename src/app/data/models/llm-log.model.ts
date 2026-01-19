import { DateTime } from 'luxon';
import { LlmLog, LlmLogDb } from '../interfaces/llm-log.interface';

export class LlmLogModel implements LlmLog {
    llmLogId: string;
    llmStructureId: string;
    sessionId: string;
    question: string;
    answer: string;
    sources: string[];
    createdAt: DateTime;
    updatedAt: DateTime;

    constructor(data: LlmLog) {
        this.llmLogId = data.llmLogId;
        this.llmStructureId = data.llmStructureId;
        this.sessionId = data.sessionId;
        this.question = data.question;
        this.answer = data.answer;
        this.sources = data.sources;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static parseDb(data: LlmLogDb): LlmLog {
        return new LlmLogModel({
            llmLogId: data.llm_log_id,
            llmStructureId: data.llm_structure_id,
            sessionId: data.session_id,
            question: data.question,
            answer: data.answer,
            sources: data.sources || [],
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }
}
