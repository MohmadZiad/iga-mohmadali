import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { API_URL } from '../../../../environments/environments';
import { CreateProjectDTO, ProjectItemDB, ProjectItem } from './project.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private http = inject(HttpClient);

    projectsList = signal<ProjectItem[]>([]);

    createProject(body: CreateProjectDTO) {
        const url = `${API_URL}/project`;
        return this.http.post(url, body);
    }

    getProjects(): Observable<ProjectItem[]> {
        const url = `${API_URL}/project/list`;
        return this.http.get<ProjectItemDB[]>(url).pipe(
            map((res): ProjectItem[] =>
                res.map((item) => ({
                    projectId: item.project_id,
                    projectName: item.project_name,
                    projectDescription: item.project_description,
                    userId: item.user_id,
                    startsAt: item.starts_at,
                    endsAt: item.ends_at,
                }))
            ),
            tap((res) => this.projectsList.set(res))
        );
    }
}
