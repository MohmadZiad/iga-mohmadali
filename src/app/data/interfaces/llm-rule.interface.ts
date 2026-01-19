import { DateTime } from 'luxon';

export interface LlmRuleDb {
    llm_rule_id: string;
    llm_ruleset_id: string;
    name: string;
    value: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    account_id: string;
}

export interface LlmRule {
    llmRuleId?: string;
    llmRulesetId?: string;
    name: string;
    value: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
    userId: string;
    accountId: string;
}
