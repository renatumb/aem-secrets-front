import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CommentFormComponent } from './comment-form.component';
import { CommentsService } from '../../services/comments.service';
import { RecaptchaService } from '../../../shared/security/recaptcha.service';
import { RecaptchaUnavailableError } from '../../../shared/security/recaptcha.model';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let commentsService: jasmine.SpyObj<CommentsService>;
  let recaptcha: jasmine.SpyObj<RecaptchaService>;

  beforeEach(async () => {
    commentsService = jasmine.createSpyObj('CommentsService', ['create']);
    commentsService.create.and.returnValue(of({} as any));
    recaptcha = jasmine.createSpyObj('RecaptchaService', ['execute']);
    recaptcha.execute.and.returnValue(of('test-token'));

    await TestBed.configureTestingModule({
      declarations: [CommentFormComponent],
      imports: [FormsModule],
      providers: [
        { provide: CommentsService, useValue: commentsService },
        { provide: RecaptchaService, useValue: recaptcha },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    component.postId = 'post-1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit a comment with a recaptcha token', () => {
    component.nameAuthor = 'Ada';
    component.emailAuthor = 'ada@example.com';
    component.content = 'This is a thoughtful comment.';

    component.onSubmit();

    expect(recaptcha.execute).toHaveBeenCalledWith('comment');
    expect(commentsService.create).toHaveBeenCalledWith(
      {
        nameAuthor: 'Ada',
        emailAuthor: 'ada@example.com',
        content: 'This is a thoughtful comment.',
        post: { id: 'post-1' },
      },
      'test-token',
    );
    expect(component.successMessage).toContain('moderation');
  });

  it('should show a verification error when reCAPTCHA fails', () => {
    recaptcha.execute.and.returnValue(throwError(() => new RecaptchaUnavailableError()));
    component.nameAuthor = 'Ada';
    component.emailAuthor = 'ada@example.com';
    component.content = 'This is a thoughtful comment.';

    component.onSubmit();

    expect(commentsService.create).not.toHaveBeenCalled();
    expect(component.error).toContain('verify');
  });
});
