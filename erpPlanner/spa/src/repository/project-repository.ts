import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProjectModel } from "../model/project-model";
import { BaseUrl } from "../shared/shared-variable";

export class ProjectRepository {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getProjectById(id: number): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`${BaseUrl}/project/${id}`);
  }


}
