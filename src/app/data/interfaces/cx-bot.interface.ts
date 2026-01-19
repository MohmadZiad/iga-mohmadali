export interface CxBotItem {
    id: string;
    botId: string;
    botName: string;
    botType: string;
    botAliasId: string;
    botStatus: string;
    llmStructureId: string;
    knowledgeBaseId: string;
    creationDateTime: string;
    lastUpdatedDateTime: string;
}

export type CxBotList = CxBotItem[];
