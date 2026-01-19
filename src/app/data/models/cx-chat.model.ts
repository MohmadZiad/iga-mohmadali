import { CxChat, CxChatDb } from '../interfaces/cx-chat.interface';
import { DateTime } from 'luxon';

export class CxChatModel implements CxChat {
    chatId: string;
    name: string;
    alias: string;

    botId: string;
    aiAgentId: string;
    instanceId: string;

    createdAt: DateTime;
    updatedAt: DateTime;

    constructor(data: Partial<CxChat> = {}) {
        this.aiAgentId = data.aiAgentId!;
        this.alias = data.alias!;
        this.botId = data.botId!;
        this.chatId = data.chatId!;
        this.createdAt = data.createdAt!;
        this.name = data.name!;
        this.updatedAt = data.updatedAt!;
        this.instanceId = data.instanceId!;
    }

    static parseDb(data: CxChatDb): CxChat {
        return new CxChatModel({
            chatId: data.chat_id,
            name: data.name,
            alias: data.alias,
            botId: data.bot_id,
            aiAgentId: data.ai_agent_id,
            instanceId: data.instance_id,
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }
}
