export type MailConfig = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  sender_email?: string;
  email_name?: string;
};

export type MailOptions = {
  mailTo: string[];
  subject: string;
  content: string;
  attachments?: Attachment[];
  cc?: string[];
};

export type Attachment = {
  filename: string;
  path: string;
};
