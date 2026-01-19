export interface CxAiAgentItem {
    id: string;
    agentId: string;
    agentName: string;
    agentAliasId: string;
    agentVersion: string;
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

export type CxAiAgentList = CxAiAgentItem[];

export interface CxActionGroupListRequest {
    agentId: string;
    agentVersion: string;
}

export interface CxActionGroupListResponse {
    $metadata: object; // TODO: describe obj
    actionGroupSummaries: CxActionGroupSummary[];
}

export interface CxActionGroupSummary {
    actionGroupId: string;
    actionGroupName: string;
    actionGroupState: string;
    description: string;
    updatedAt: string;
}

export interface CxActionGroupRequest {
    agentId: string;
    agentVersion: string;
    actionGroupId: string;
}

export interface CxActionGroupResponse {
    $metadata: object; // TODO: describe obj
    agentActionGroup: CxActionGroup;
}

export interface CxActionGroup {
    actionGroupExecutor: { lambda: string }; // TODO: describe obj
    actionGroupId: string;
    actionGroupName: string;
    actionGroupState: string;
    agentId: string;
    agentVersion: string;
    clientToken: string;
    createdAt: string;
    description: string;
    functionSchema: { functions: object }; // TODO: describe obj
    updatedAt: string;
}

export interface CxActionGroupFilter {
    search: string;
}
