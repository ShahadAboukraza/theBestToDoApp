import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTimeline } from './todo-timeline';

describe('TodoTimeline', () => {
  let component: TodoTimeline;
  let fixture: ComponentFixture<TodoTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
