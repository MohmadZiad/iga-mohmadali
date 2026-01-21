import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../../../../../.environments/dev/environments';
import { CreateProjectDTO, ProjectItem } from './project.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private http = inject(HttpClient);

    createProject(body: CreateProjectDTO) {
        const url = `${API_URL}/project`;
        return this.http.post(url, body);
    }

    getProjects(): Observable<ProjectItem[]> {
        const url = `${API_URL}/project/list`;
        return this.http.get<any[]>(url).pipe(
            map((projects) =>
                projects.map((project) => ({
                    projectId: project.project_id || project.id,
                    projectName: project.project_name || project.name,
                }))
            )
        );
    }
}
