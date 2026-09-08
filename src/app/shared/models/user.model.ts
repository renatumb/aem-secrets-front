/**
 * User domain contract aligned with the backend User entity.
 * Password is never displayed from API values in the UI.
 * photoProfile is a storage path; use UsersService.resolvePhotoProfileUrl to display it.
 */
export enum AccessLevel {
  CAN_READ = 'CAN_READ',
  CAN_WRITE = 'CAN_WRITE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  about?: string;
  photoProfile?: string;
  accessLevel: AccessLevel;
  accountLocked: boolean;
}

/**
 * Partial update payload for PUT /user/{id}.
 * Any subset of fields may be sent; omitted fields are left unchanged.
 * When a new image is chosen, pass it as `photo` (multipart); the BE stores the path in photoProfile.
 */
export interface UpdateUserDto {
  about?: string;
  photo?: File;
  accessLevel?: AccessLevel;
  accountLocked?: boolean;
  password?: string;
}

/** Query options for paged/sorted user lookups (editor). */
export interface UserListQuery {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  orderBy?: string;
}
