export interface CreateProjectDTO {
    project_name: string;
    project_description: string;
    user_id: string;
    starts_at: string;
    ends_at: string;
}

export interface ProjectItemDB {
    project_id: string;
    project_name: string;
    project_description: string;
    user_id: string;
    starts_at: string;
    ends_at: string;
}

export interface ProjectItem {
    projectId: string;
    projectName: string;
    projectDescription: string;
    userId: string;
    startsAt: string;
    endsAt: string;
}
