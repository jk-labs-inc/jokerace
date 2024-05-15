export type ExtensionMetadata = {
  title: string;
  creator: string;
  description: string;
  buttonLabel: string;
};

export type Extension = {
  name: string;
  metadata: ExtensionMetadata;
};
