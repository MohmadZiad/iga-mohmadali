import { CxAgent, CxAgentDb } from '../interfaces/cx-agent.interface';
import { DateTime } from 'luxon';

export class CxAgentModel implements CxAgent {
    agentId: string;
    username: string;
    password: string;
    role: string;
    instanceId: string;
    createdAt: DateTime;
    updatedAt: DateTime;

    constructor(data: Partial<CxAgent>) {
        this.agentId = data.agentId!;
        this.username = data.username!;
        this.password = data.password!;
        this.role = data.role!;
        this.instanceId = data.instanceId!;
        this.createdAt = data.createdAt!;
        this.updatedAt = data.updatedAt!;
    }

    static parseDb(data: CxAgentDb): CxAgent {
        return new CxAgentModel({
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
