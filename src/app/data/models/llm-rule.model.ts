import { LlmRule, LlmRuleDb } from '../interfaces/llm-rule.interface';
import { DateTime } from 'luxon';

export class LlmRuleModel implements LlmRule {
    llmRuleId?: string;
    llmRulesetId?: string;
    name: string;
    value: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    userId: string;
    accountId: string;

    constructor(data: Partial<LlmRule> = {}) {
        this.llmRuleId = data.llmRuleId;
        this.llmRulesetId = data.llmRulesetId;
        this.name = data.name!;
        this.value = data.value!;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.userId = data.userId!;
        this.accountId = data.accountId!;
    }

    static parseDb(data: LlmRuleDb): LlmRule {
        return new LlmRuleModel({
            llmRuleId: data.llm_rule_id,
            llmRulesetId: data.llm_ruleset_id,
            name: data.name,
            value: data.value,
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }

    formatDb(): LlmRuleDb {
        return {
            llm_rule_id: this.llmRuleId,
            llm_ruleset_id: this.llmRulesetId,
            name: this.name,
            value: this.value,
            user_id: this.userId,
            account_id: this.accountId,
        } as LlmRuleDb;
    }
}
