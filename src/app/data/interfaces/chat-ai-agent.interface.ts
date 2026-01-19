export interface ChatAiAgentItem {
    id: string;
    alias: string;
    agentId: string;
    agentName: string;
    agentAliasId: string;
    agentCollaboration: string;
    foundationModel: string;
    idleSessionTTLInSeconds: number;
    llmStructureId: string;
    knowledgeBaseId: string;
    agentStatus: string;
    description: string;
    instruction: string;
    orchestrationType: string;
    preparedAt: string;
    createdAt: string;
    updatedAt: string;
}

export type ChatAiAgentList = ChatAiAgentItem[];
