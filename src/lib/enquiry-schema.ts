import {z} from "zod";

function toUtcDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export const enquirySchema = z
  .object({
    interest: z.enum(["house", "winter", "cycling", "explore"]),
    arrival: z.string().min(1, "Choose an arrival date."),
    departure: z.string().min(1, "Choose a departure date."),
    guests: z.number().int().min(2).max(5),
    cyclists: z.number().int().min(0).max(5),
    practicalNeeds: z.array(z.enum(["parking", "bike-box", "transfer"])),
    name: z.string().trim().min(2, "Tell us your name."),
    email: z.email("Enter a valid email address."),
    message: z.string().trim().max(1000, "Keep the note under 1,000 characters.").optional(),
  })
  .superRefine((values, context) => {
    if (values.arrival && values.departure) {
      const nights =
        (toUtcDay(values.departure) - toUtcDay(values.arrival)) / 86_400_000;

      if (nights <= 0) {
        context.addIssue({
          code: "custom",
          path: ["departure"],
          message: "Departure must be after arrival.",
        });
      } else if (nights < 15) {
        context.addIssue({
          code: "custom",
          path: ["departure"],
          message: "Stays must be at least 15 nights.",
        });
      }
    }

    if (values.cyclists > values.guests) {
      context.addIssue({
        code: "custom",
        path: ["cyclists"],
        message: "Cyclists cannot exceed the number of guests.",
      });
    }
  });
