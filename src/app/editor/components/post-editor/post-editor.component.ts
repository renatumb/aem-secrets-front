import { Component } from '@angular/core';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.css',
})
export class PostEditorComponent {
  postTitle = '';
  excerpt =
    'A short summary that appears in listings and SEO snippets. Keep it concise and inviting so readers know what to expect.';
  content = '';
  categoryId = '';

  readonly categoryOptions: { id: string; label: string }[] = [
    { id: '', label: 'Please select a category' },
    { id: 'firebase', label: 'Firebase' },
    { id: 'bootstrap', label: 'Bootstrap' },
    { id: 'angular', label: 'Angular' },
    { id: 'resources', label: 'Resources' },
  ];

  /** Shown in the permalink field; derived from the title for a classic CMS feel. */
  permalinkSlug = 'post-title';

  imagePreview: string | null =
    'https://picsum.photos/seed/post-editor-cover/480/270';

  selectedImageLabel = 'No file chosen';

  onTitleChange(value: string): void {
    this.postTitle = value;
    this.permalinkSlug = this.slugify(value) || 'post-title';
  }

  onImageFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.selectedImageLabel = 'No file chosen';
      return;
    }
    this.selectedImageLabel = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private slugify(raw: string): string {
    return raw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
