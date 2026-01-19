import { DateTime } from 'luxon';

export interface ChatAgentDb {
    agent_id: string;
    username: string;
    password: string;
    role: string;
    instance_id: string;
    created_at: string;
    updated_at: string;
}

export interface ChatAgent {
    agentId: string;
    username: string;
    password: string;
    role: string;
    instanceId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface ChatAgentFilter {
    search: string;
}
