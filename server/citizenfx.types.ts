export type Deferrals = {
  defer: () => void;
  update: (message: string) => void;
  done(failureReason?: string): void;
};
