export const digitsOnly = (s: string) => s.replace(/\D+/g, "");

export const normalizeMobile = (mobile: string) => digitsOnly(mobile);

type Args = {
  step: "phone" | "details";
  mobile: string;
  idNumber: string;
  birthYear: string;
  birthMonth: string;
  checking: boolean;
};

export function computeCanContinue({
  step,
  mobile,
  idNumber,
  birthYear,
  birthMonth,
  checking,
}: Args): boolean {
  const normalizedMobile = normalizeMobile(mobile);
  const phoneValid =
    normalizedMobile.length === 10 && normalizedMobile.startsWith("05");
  const idValid = digitsOnly(idNumber).length >= 8;
  const yearValid =
    +birthYear >= 1900 && +birthYear <= new Date().getFullYear() - 18;
  const monthValid =
    /^\d{1,2}$/.test(birthMonth) && +birthMonth >= 1 && +birthMonth <= 12;

  if (step === "phone") return phoneValid && !checking;
  return phoneValid && idValid && yearValid && monthValid && !checking;
}
