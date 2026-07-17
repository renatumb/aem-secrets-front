/**
 * Public contact-form payload for POST /contact/send.
 */
export interface ContactMessageDto {
  name: string;
  email: string;
  message: string;
}
