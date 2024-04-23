export type MessageOptionsProperties = Record<string, string | number>;

export type MessageOptions = {
  readonly customLanguages?: string[];
  readonly properties?: MessageOptionsProperties;
};

export type MessageErrorOptions = {
  readonly customLanguages?: string[];
};

export type MessageSetOptions = Omit<MessageOptions, 'customLanguages'>;
