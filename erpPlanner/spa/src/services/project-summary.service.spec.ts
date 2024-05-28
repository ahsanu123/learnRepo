import { TestBed } from '@angular/core/testing';
import { ProjectSummaryService } from './project-summary.service';


describe('ProjectSummaryService', () => {
  let service: ProjectSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
