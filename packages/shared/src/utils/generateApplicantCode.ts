export function generateApplicantCode(): string {
  const prefix = "APP";
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${num}-${suffix}`;
}
