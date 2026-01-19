import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateProjectDTO } from '../../../../data/api-services/project/project.interface';
import { ProjectService } from '../../../../data/api-services/project/project.service';
import { UserService } from '../../../../data/api-services/user/user.service';
import { DatepickerData, F2DatepickerComponent } from '../../../../shared/components/f2-datepicker/f2-datepicker.component';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-create-project',
    imports: [ReactiveFormsModule, CommonModule, F2DatepickerComponent],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent implements OnInit {
    router = inject(Router);
    userService = inject(UserService);
    formBuilder = inject(FormBuilder);
    projectService = inject(ProjectService);

    projectForm!: FormGroup;
    submitted = false;

    dateRange = {
        startDate: DateTime.now().startOf('day').toISO()!,
        endDate: DateTime.now().plus({ days: 6 }).endOf('day').toISO()!,
    };

    ngOnInit(): void {
        this.projectForm = this.formBuilder.group({
            projectName: ['', Validators.required],
            projectDescription: [''],
        });
    }

    onAdd(): void {
        this.submitted = true;
        if (!this.projectForm.valid) {
            return;
        }

        const body: CreateProjectDTO = {
            project_description: this.projectForm.value['projectDescription'],
            project_name: this.projectForm.value['projectName'],
            user_id: this.userService.authUser.userId,
            starts_at: this.dateRange.startDate,
            ends_at: this.dateRange.endDate,
        };

        this.projectService.createProject(body).subscribe({
            next: () => this.router.navigate(['pm/add-services']),
            // TODO: add handling errors to show notifications
            error: (error) => console.log(error),
        });
    }

    onClear(): void {
        this.submitted = false;
        this.projectForm.reset();
    }

    onChangeDateRange(dateRange: DatepickerData) {
        this.dateRange.startDate = DateTime.fromFormat(dateRange.startDate, 'yyyy-MM-dd').toISO()!;
        this.dateRange.endDate = DateTime.fromFormat(dateRange.endDate, 'yyyy-MM-dd').endOf('day').toISO()!;
    }
}
