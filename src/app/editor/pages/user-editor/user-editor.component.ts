import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../services/users.service';
import {
  AccessLevel,
  UpdateUserDto,
  User,
} from '../../../shared/models/user.model';
import { toUserMessage } from '../../../shared/http/user-facing-error';
import { PLACEHOLDER_THUMBNAIL } from '../../../shared/placeholder';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.css',
})
export class UserEditorComponent implements OnInit, OnDestroy {
  readonly accessLevelOptions = Object.values(AccessLevel);
  readonly passwordMask = '••••••••';
  readonly placeholderPhoto = PLACEHOLDER_THUMBNAIL;

  editingUser: User | null = null;

  formUserId: string | null = null;
  formName = '';
  formEmail = '';
  formAbout = '';
  formAccessLevel: AccessLevel | null = null;
  formAccountLocked = false;
  formPhotoPreview: string | null = null;

  selectedPhoto: File | null = null;
  selectedPhotoLabel = 'No file chosen';

  loading = false;
  loadError: string | null = null;
  saving = false;
  saveError: string | null = null;
  saveSuccess: string | null = null;

  private readonly destroy$ = new Subject<void>();
  private objectUrl: string | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.resolveEditingUser();
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get controlsDisabled(): boolean {
    return this.loading || this.saving || !!this.loadError || !this.editingUser;
  }

  onPhotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      this.selectedPhoto = null;
      this.selectedPhotoLabel = 'No file chosen';
      return;
    }

    this.selectedPhoto = file;
    this.selectedPhotoLabel = file.name;
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.formPhotoPreview = this.objectUrl;
    this.saveSuccess = null;
  }

  onPhotoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.placeholderPhoto) {
      img.src = this.placeholderPhoto;
    }
  }

  toggleAccountLocked(): void {
    if (this.controlsDisabled) {
      return;
    }
    this.formAccountLocked = !this.formAccountLocked;
    this.saveSuccess = null;
  }

  onCancel(): void {
    void this.router.navigate(['/editor/users']);
  }

  onSave(): void {
    if (!this.formUserId || !this.editingUser || this.saving) {
      return;
    }

    if (!this.formAccessLevel) {
      this.saveError = 'Access level is required.';
      return;
    }

    const payload: UpdateUserDto = {
      about: this.formAbout.trim(),
      accessLevel: this.formAccessLevel,
      accountLocked: this.formAccountLocked,
    };

    if (this.selectedPhoto) {
      payload.photo = this.selectedPhoto;
    }

    this.saving = true;
    this.saveError = null;
    this.saveSuccess = null;

    this.usersService
      .update(this.formUserId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.selectedPhoto = null;
          this.selectedPhotoLabel = 'No file chosen';
          this.applyUser(updated);
          this.saveSuccess = 'User saved successfully.';
        },
        error: (err) => {
          this.saving = false;
          this.saveError = toUserMessage(err, 'Could not save user.');
          console.error('Could not save user.', err);
        },
      });
  }

  private resolveEditingUser(): void {
    const idFromRoute = this.activatedRoute.snapshot.queryParamMap.get('id');
    const stateUser = history.state?.['user'] as User | undefined;

    this.formUserId = idFromRoute;
    this.loadError = null;

    if (stateUser?.id && (!idFromRoute || stateUser.id === idFromRoute)) {
      this.applyUser(stateUser);
      return;
    }

    if (idFromRoute) {
      this.loadUserById(idFromRoute);
      return;
    }

    this.loadError = 'User id is missing. Open the editor with ?id= in the URL.';
  }

  private loadUserById(id: string): void {
    this.loading = true;
    this.loadError = null;

    this.usersService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.applyUser(user);
        },
        error: (err) => {
          this.loading = false;
          this.loadError = toUserMessage(
            err,
            'Could not load user. Open this user from the users list.',
          );
          console.error('Could not load user by id.', err);
        },
      });
  }

  private applyUser(user: User): void {
    this.editingUser = user;
    this.formUserId = user.id;
    this.formName = user.name ?? '';
    this.formEmail = user.email ?? '';
    this.formAbout = user.about ?? '';
    this.formAccessLevel = user.accessLevel ?? null;
    this.formAccountLocked = !!user.accountLocked;

    this.revokeObjectUrl();
    this.formPhotoPreview = user.photoProfile ? this.usersService.resolvePhotoProfileUrl(user.photoProfile) : null;
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
