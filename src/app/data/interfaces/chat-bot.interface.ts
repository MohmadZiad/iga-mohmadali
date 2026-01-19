export interface ChatBotItem {
    id: string;
    alias: string;
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

export type ChatBotList = ChatBotItem[];
