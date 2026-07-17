import type { ResumeVersionInput } from "@/schemas/resumes/resume-version";

export type ResumeVersionFieldErrors = Partial<
  Record<keyof ResumeVersionInput, string[]>
>;

export interface ResumeVersionActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: ResumeVersionFieldErrors;
  values?: Partial<Record<keyof ResumeVersionInput, string>>;
}

export const INITIAL_RESUME_VERSION_STATE: ResumeVersionActionState = {
  status: "idle",
};

export interface DeleteResumeVersionActionState {
  status: "idle" | "success" | "error";
  message?: string;
  resumeVersionId?: string;
}

export const INITIAL_DELETE_RESUME_VERSION_STATE: DeleteResumeVersionActionState =
  { status: "idle" };

export interface ResumeAssociationActionState {
  status: "idle" | "success" | "error";
  message?: string;
  resumeVersionId?: string | null;
}

export const INITIAL_RESUME_ASSOCIATION_STATE: ResumeAssociationActionState = {
  status: "idle",
};
