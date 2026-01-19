import { LlmStructure, LlmStructureDb } from '../interfaces/llm-structure.interface';
import { DateTime } from 'luxon';

export class LlmStructureModel implements LlmStructure {
    llmStructureId?: string;
    llmTaskId?: string;
    llmQueryEngineId?: string;
    llmPromptDriverId?: string;
    llmRulesetId?: string;

    name: string;
    model: string;
    temperature: number;
    topP: number;
    topN: number;
    type: string;
    embeddingDriver: string;
    sourceType: string;
    sourceId: string;
    framework: string;
    memorySize: number;
    userId: string;
    accountId: string;
    isRagApi: boolean;
    isHybridSearch: boolean;
    assistantAppendix: string;
    preamble: string;

    createdAt: DateTime;

    constructor(data: Partial<LlmStructure> = {}) {
        this.llmStructureId = data.llmStructureId;
        this.llmTaskId = data.llmTaskId;
        this.llmPromptDriverId = data.llmPromptDriverId;
        this.llmQueryEngineId = data.llmQueryEngineId;
        this.llmRulesetId = data.llmRulesetId!;

        this.name = data.name!;
        this.model = data.model!;
        this.temperature = data.temperature!;
        this.topP = data.topP!;
        this.topN = data.topN!;
        this.type = data.type!;
        this.embeddingDriver = data.embeddingDriver!;
        this.sourceType = data.sourceType!;
        this.sourceId = data.sourceId!;
        this.framework = data.framework ?? 'griptape';
        this.memorySize = data.memorySize!;
        this.userId = data.userId!;
        this.accountId = data.accountId!;
        this.isRagApi = data.isRagApi!;
        this.isHybridSearch = data.isHybridSearch!;
        this.assistantAppendix = data.assistantAppendix!;
        this.preamble = data.preamble!;

        this.createdAt = data.createdAt!;
    }

    static parseDb(data: LlmStructureDb): LlmStructure {
        return new LlmStructureModel({
            llmStructureId: data.llm_structure_id,
            name: data.name,
            framework: data.framework,
            // memory: data.memory,
            memorySize: data.memory_size,
            // memoryDriver: data.memory_driver,

            // first task
            llmTaskId: data.llm_task_id,
            assistantAppendix: data.assistant_appendix,
            preamble: data.preamble,
            type: data.type,

            // first task query engine
            llmQueryEngineId: data.llm_query_engine_id,
            isHybridSearch: data.use_hybrid_search,
            isRagApi: data.use_rag_api,
            embeddingDriver: data.embedding_driver,
            sourceType: data.vector_store_driver,
            sourceId: data.namespace,
            topN: data.top_n,

            // first task prompt driver
            llmPromptDriverId: data.llm_prompt_driver_id,
            model: data.model,
            temperature: data.temperature,
            topP: data.top_p,

            // first task ruleset
            llmRulesetId: data.llm_ruleset_id,

            createdAt: DateTime.fromISO(data.created_at),
        });
    }
}
