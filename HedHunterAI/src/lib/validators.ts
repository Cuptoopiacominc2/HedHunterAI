import { z } from "zod";

export const companyProfileSchema = z.object({
  name:              z.string().min(2, "Company name required"),
  industry:          z.string().min(1, "Industry required"),
  website:           z.string().url("Invalid URL").optional().or(z.literal("")),
  contactPerson:     z.string().min(2, "Contact name required"),
  contactTitle:      z.string().optional(),
  phone:             z.string().min(7, "Phone required"),
  city:              z.string().min(1, "City required"),
  state:             z.string().min(1, "State / Province required"),
  county:            z.string().optional(),
  zipCode:           z.string().min(1, "Zip code required"),
  annualRevenue:     z.string().optional(),
  meritPledgeSigned: z.boolean().refine(v => v, "Merit pledge must be signed"),
});

export const jobPostSchema = z.object({
  title:                   z.string().min(3, "Title required"),
  description:             z.string().min(20, "Description required"),
  requiredQualifications:  z.string().min(10, "Required qualifications required"),
  preferredQualifications: z.string().optional(),
  salaryMin:               z.number().int().positive().optional(),
  salaryMax:               z.number().int().positive().optional(),
  country:                 z.string().optional(),
  state:                   z.string().optional(),
  county:                  z.string().optional(),
  city:                    z.string().optional(),
  zipCode:                 z.string().optional(),
  isRemote:                z.boolean().default(false),
  isHybrid:                z.boolean().default(false),
  isOffice:                z.boolean().default(false),
  isOnLocation:            z.boolean().default(false),
  openPositions:           z.number().int().min(1).max(50),
});

export const interviewQuestionSchema = z.object({
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  timeLimitSec: z.number().int().min(30).max(600),
  idealAnswer:  z.string().optional(),
  weight:       z.number().min(0.5).max(3.0),
});

export const appealSchema = z.object({
  reason: z.string().min(50, "Please provide at least 50 characters explaining your appeal"),
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().optional(),
});

export const accommodationSchema = z.object({
  type:  z.enum(["untimed_written", "extended_time", "written_only"]),
  notes: z.string().optional(),
});

export type CompanyProfileInput      = z.infer<typeof companyProfileSchema>;
export type JobPostInput             = z.infer<typeof jobPostSchema>;
export type InterviewQuestionInput   = z.infer<typeof interviewQuestionSchema>;
export type AppealInput              = z.infer<typeof appealSchema>;
export type RatingInput              = z.infer<typeof ratingSchema>;
export type AccommodationInput       = z.infer<typeof accommodationSchema>;
