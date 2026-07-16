export interface DeleteApplicationActionState {
  status: "idle" | "pending" | "success" | "error";
  applicationId?: string;
  message?: string;
}

export const INITIAL_DELETE_APPLICATION_STATE: DeleteApplicationActionState = {
  status: "idle",
};
