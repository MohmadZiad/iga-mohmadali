import { DateTime } from 'luxon';

export interface CxAgentDb {
    agent_id: string;
    username: string;
    password: string;
    role: string;
    instance_id: string;
    created_at: string;
    updated_at: string;
}

export interface CxAgent {
    agentId: string;
    username: string;
    password: string;
    role: string;
    instanceId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface CxAgentFilter {
    search: string;
}
