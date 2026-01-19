import { DateTime } from 'luxon';
import { LlmStructureSharedToken, LlmStructureSharedTokenDb } from '../interfaces/llm-structure-shared-token.interface';

export class LlmStructureSharedTokenModel implements LlmStructureSharedToken {
    llmStructureSharedTokenId?: string;
    llmStructureId: string;
    description: string;
    sharedToken: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;

    constructor(data: Partial<LlmStructureSharedToken> = {}) {
        this.llmStructureSharedTokenId = data.llmStructureSharedTokenId;
        this.llmStructureId = data.llmStructureId!;
        this.description = data.description!;
        this.sharedToken = data.sharedToken!;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static parseDb(data: LlmStructureSharedTokenDb): LlmStructureSharedToken {
        return new LlmStructureSharedTokenModel({
            llmStructureSharedTokenId: data.llm_structure_shared_token_id,
            llmStructureId: data.llm_structure_id,
            description: data.description,
            sharedToken: data.shared_token,
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }

    formatDb(): LlmStructureSharedTokenDb {
        return {
            llm_structure_shared_token_id: this.llmStructureSharedTokenId,
            llm_structure_id: this.llmStructureId,
            description: this.description,
            shared_token: this.sharedToken,
        } as LlmStructureSharedTokenDb;
    }
}
