import type { ApplicationFormInput } from "@/schemas/applications/application";

export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationFormInput, string[]>
>;

export interface ApplicationActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: ApplicationFieldErrors;
  values?: Partial<Record<keyof ApplicationFormInput, string>>;
}

export const INITIAL_APPLICATION_STATE: ApplicationActionState = {
  status: "idle",
};
