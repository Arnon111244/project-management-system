export type NewUserPayload = {
  mobile: string;
  idNumber: string;
  birthYear: string;
  birthMonth: string;
};

export type LoginStep = "phone" | "details";
