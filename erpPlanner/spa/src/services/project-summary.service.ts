import { Injectable } from '@angular/core';
import { ProjectModel } from '../model/project-model';
import { ProjectRepository } from '../repository/project-repository';

@Injectable({
  providedIn: 'root'
})
export class ProjectSummaryService {
  private projectRepo: ProjectRepository;

  constructor(projectRepo: ProjectRepository) {
    this.projectRepo = projectRepo;
  }

  getProjectSummary(id: number) {
    this.projectRepo.getProjectById(id).subscribe((value) => {

    });
  }

}
