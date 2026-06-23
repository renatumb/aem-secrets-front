import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PostEditorComponent } from './post-editor.component';
import { CategoriesService } from '../../services/categories.service';
import { PostsService } from '../../services/posts.service';

describe('PostEditorComponent', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostEditorComponent],
      imports: [HttpClientTestingModule, FormsModule, AngularEditorModule],
      providers: [
        {
          provide: CategoriesService,
          useValue: { list: () => of({ content: [] }) },
        },
        {
          provide: PostsService,
          useValue: {
            uploadImage: () => of({ imageUrl: '94c089fb-567e-480a-921d-c19842ed5441\\bike1.jpg' }),
            resolveUploadedImageUrl: (imageUrl: string) => imageUrl,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ id: '94c089fb-567e-480a-921d-c19842ed5441' })),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
