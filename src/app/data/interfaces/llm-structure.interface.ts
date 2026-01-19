import { DateTime } from 'luxon';

export interface LlmStructureDb {
    llm_structure_id: string;
    name: string;
    framework: string;
    memory: string;
    memory_size: number;
    memory_driver: string;

    // first task
    llm_task_id: string;
    assistant_appendix: string;
    preamble: string;
    type: string;

    // first task query engine
    llm_query_engine_id: string;
    use_hybrid_search: boolean;
    use_rag_api: boolean;
    embedding_driver: string;
    vector_store_driver: string;
    namespace: string;
    top_n: number;

    // first task prompt driver
    llm_prompt_driver_id: string;
    model: string;
    temperature: number;
    top_p: number;

    // first task ruleset
    llm_ruleset_id: string;

    created_at: string;
}

export interface LlmStructureApi {
    structure: LlmStructure;
}

export interface LlmStructure {
    llmStructureId?: string;
    llmTaskId?: string;
    llmPromptDriverId?: string;
    llmQueryEngineId?: string;
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
}
