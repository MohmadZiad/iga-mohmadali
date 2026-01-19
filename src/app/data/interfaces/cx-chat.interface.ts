import { DateTime } from 'luxon';

export interface CxChatDb {
    chat_id: string;
    name: string;
    alias: string;
    bot_id: string;
    instance_id: string;
    ai_agent_id: string;
    created_at: string;
    updated_at: string;
}

export interface CxChat {
    chatId: string;
    name: string;
    alias: string;
    botId: string;
    instanceId: string;
    aiAgentId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}
