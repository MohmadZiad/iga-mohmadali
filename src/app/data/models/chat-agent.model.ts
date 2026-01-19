import { ChatAgent, ChatAgentDb } from '../interfaces/chat-agent.interface';
import { DateTime } from 'luxon';

export class ChatAgentModel implements ChatAgent {
    agentId: string;
    username: string;
    password: string;
    role: string;
    instanceId: string;
    createdAt: DateTime;
    updatedAt: DateTime;

    constructor(data: Partial<ChatAgent>) {
        this.agentId = data.agentId!;
        this.username = data.username!;
        this.password = data.password!;
        this.role = data.role!;
        this.instanceId = data.instanceId!;
        this.createdAt = data.createdAt!;
        this.updatedAt = data.updatedAt!;
    }

    static parseDb(data: ChatAgentDb): ChatAgent {
        return new ChatAgentModel({
            agentId: data.agent_id,
            username: data.username,
            password: data.password,
            role: data.role,
            instanceId: data.instance_id,
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }
}
