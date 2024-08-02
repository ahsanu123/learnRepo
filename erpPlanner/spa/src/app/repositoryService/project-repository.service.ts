import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectModel } from '../model';
import { BaseUrl } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepositoryService {

  project$ = this.http.get<ProjectModel>(`${BaseUrl}/Project/get/1`)

  constructor(private http: HttpClient) { }
}
