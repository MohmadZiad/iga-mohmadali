import { Routes } from '@angular/router';
import { canAccessByFeatureFlag, canActivateAuth, canAdminUser, canRootAccount } from './auth/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { MainViewComponent } from './shared/layers/main-view/main-view.component';
import { HomeComponent } from './pages/home/home.component';

import { PMODashboardComponent } from './pages/kpi/pmo-dashboard/pmo-dashboard.component';
import { EntityProfileComponent } from './pages/kpi/entity-profile/entity-profile.component';
import { EntityListComponent } from './pages/kpi/entity-list/entity-list.component';
import { UploadOrdersComponent } from './pages/kpi/upload-orders/upload-orders.component';

import { LlmStructuresComponent } from './pages/llm/llm-structures/llm-structures.component';
import { LlmDataSourcesComponent } from './pages/llm/llm-data-sources/llm-data-sources.component';
import { LlmStructureDetailsComponent } from './pages/llm/llm-structure-details/llm-structure-details.component';
import { LlmDataSourceDetailsComponent } from './pages/llm/llm-data-source-details/llm-data-source-details.component';
import { LlmStructureTabsComponent } from './pages/llm/llm-structure-tabs/llm-structure-tabs.component';
import { LlmStructureDemoComponent } from './pages/llm/llm-structure-demo/llm-structure-demo.component';
import { ProfileComponent } from './pages/settings/profile.component';
import { LlmStructureLogsComponent } from './pages/llm/llm-structure-logs/llm-structure-logs.component';
import { CxBotsContainerComponent } from './pages/cx/cx-bots/cx-bots-container/cx-bots-container.component';
import { CxAgentsContainerComponent } from './pages/cx/cx-agents/cx-agents-container/cx-agents-container.component';
import { CxAiAgentsContainerComponent } from './pages/cx/cx-ai-agents/cx-ai-agents-container/cx-ai-agents-container.component';
import { CxAgentsListComponent } from './pages/cx/cx-agents/cx-agents-list/cx-agents-list.component';
import { LlmStructureSharedTokensComponent } from './pages/llm/llm-structure-shared-tokens/llm-structure-shared-tokens.component';
import { CxChatsContainerComponent } from './pages/cx/cx-chats/cx-chats-container/cx-chats-container.component';
import { CxChatsDetailsComponent } from './pages/cx/cx-chats/cx-chats-details/cx-chats-details.component';
import { CxAiAgentsDetailsComponent } from './pages/cx/cx-ai-agents/cx-ai-agents-details/cx-ai-agents-details.component';
import { CxAiAgentsTabsComponent } from './pages/cx/cx-ai-agents/cx-ai-agents-tabs/cx-ai-agents-tabs.component';
import { CxAiAgentsLogsComponent } from './pages/cx/cx-ai-agents/cx-ai-agents-logs/cx-ai-agents-logs.component';
import { CxAiAgentsConfigurationComponent } from './pages/cx/cx-ai-agents/cx-ai-agents-configuration/cx-ai-agents-configuration.component';
import { CxChannelsContainerComponent } from './pages/cx/cx-channels/cx-channels-container/cx-channels-container.component';
import { CxProvidersContainerComponent } from './pages/cx/cx-providers/cx-providers-container/cx-providers-container.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UsersManagementComponent } from './pages/settings/users-management/users-management.component';
import { RolesManagementComponent } from './pages/settings/roles-management/roles-management.component';
import { ServiceCodesComponent } from './pages/kpi/admin/service-codes/service-codes.component';
import { CreateProjectComponent } from './pages/kpi/project-management/create-project/create-project.component';
import { ProjectManagementTabsComponent } from './pages/kpi/project-management/project-management-tabs/project-management-tabs.component';
import { AddServicesComponent } from './pages/kpi/project-management/add-services/add-services.component';
import { ViewProjectComponent } from './pages/kpi/project-management/view-project/view-project.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
    },
    {
        path: '',
        component: MainViewComponent,
        canActivate: [canActivateAuth],
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'kpi',
                data: { featureFlagKey: 'dashboard' },
                canActivate: [canAccessByFeatureFlag],
                children: [
                    {
                        path: 'dashboard',
                        canActivate: [canRootAccount],
                        component: PMODashboardComponent,
                    },
                    {
                        path: 'entity/:entityId',
                        component: EntityProfileComponent,
                    },
                    {
                        path: 'entity',
                        component: EntityListComponent,
                    },
                    {
                        path: 'upload',
                        component: UploadOrdersComponent,
                    },
                    {
                        path: 'admin/service-codes',
                        canActivate: [canRootAccount],
                        component: ServiceCodesComponent,
                    },
                    {
                        path: '',
                        redirectTo: 'upload',
                        pathMatch: 'full',
                    },
                ],
            },
            {
                path: 'pm',
                canActivate: [canAccessByFeatureFlag],
                data: { featureFlagKey: 'pm' },
                component: ProjectManagementTabsComponent,
                children: [
                    {
                        path: 'create-project',
                        component: CreateProjectComponent,
                    },
                    {
                        path: 'add-services',
                        component: AddServicesComponent,
                    },
                    {
                        path: 'view-project',
                        component: ViewProjectComponent,
                    },
                ],
            },
            {
                path: 'llm',
                canActivate: [canAccessByFeatureFlag],
                data: { featureFlagKey: 'llm' },
                children: [
                    {
                        path: '',
                        redirectTo: 'structures',
                        pathMatch: 'full',
                    },
                    {
                        path: 'structures',
                        component: LlmStructuresComponent,
                    },
                    {
                        path: 'structures/:structureId',
                        component: LlmStructureTabsComponent,
                        children: [
                            {
                                path: 'details',
                                component: LlmStructureDetailsComponent,
                            },
                            {
                                path: 'demo',
                                component: LlmStructureDemoComponent,
                            },
                            {
                                path: 'logs',
                                component: LlmStructureLogsComponent,
                            },
                            {
                                path: 'shared-tokens',
                                component: LlmStructureSharedTokensComponent,
                            },
                        ],
                    },
                    {
                        path: 'data-sources',
                        component: LlmDataSourcesComponent,
                    },
                    {
                        path: 'data-sources/:dataSourceId/details',
                        component: LlmDataSourceDetailsComponent,
                    },
                ],
            },
            {
                path: 'cx',
                canActivate: [canAccessByFeatureFlag],
                data: { featureFlagKey: 'cx' },
                children: [
                    {
                        path: '',
                        redirectTo: 'chats',
                        pathMatch: 'full',
                    },
                    {
                        path: 'bots',
                        component: CxBotsContainerComponent,
                    },
                    {
                        path: 'agents',
                        component: CxAgentsContainerComponent,
                    },
                    {
                        path: 'agents/:instanceId/details',
                        component: CxAgentsListComponent,
                    },
                    {
                        path: 'ai-agents',
                        component: CxAiAgentsContainerComponent,
                    },
                    {
                        path: 'ai-agents/:aiAgentId',
                        component: CxAiAgentsTabsComponent,
                        children: [
                            {
                                path: 'details',
                                component: CxAiAgentsDetailsComponent,
                            },
                            {
                                path: 'configuration',
                                component: CxAiAgentsConfigurationComponent,
                            },
                            {
                                path: 'logs',
                                component: CxAiAgentsLogsComponent,
                            },
                        ],
                    },
                    {
                        path: 'chats',
                        component: CxChatsContainerComponent,
                    },
                    {
                        path: 'chats/:chatId/details',
                        component: CxChatsDetailsComponent,
                    },
                    {
                        path: 'channels',
                        component: CxChannelsContainerComponent,
                    },
                    {
                        path: 'providers',
                        component: CxProvidersContainerComponent,
                    },
                ],
            },
            {
                path: 'settings',
                canActivate: [canAccessByFeatureFlag],
                data: { featureFlagKey: 'settings' },
                children: [
                    {
                        path: '',
                        redirectTo: 'profile',
                        pathMatch: 'full',
                    },
                    {
                        path: 'profile',
                        component: ProfileComponent,
                    },
                    {
                        canActivate: [canAdminUser],
                        path: 'users',
                        component: UsersManagementComponent,
                    },
                    {
                        canActivate: [canAdminUser],
                        path: 'roles',
                        component: RolesManagementComponent,
                    },
                ],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
