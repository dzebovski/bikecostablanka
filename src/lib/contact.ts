/** Host contact links. A missing value means the link is not rendered at all. */
const whatsappNumber = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "").replace(/\D/g, "");
const email = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim();

export const contact = {
  whatsapp: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,
  email: email ? `mailto:${email}` : null,
};

export type ContactChannel = "whatsapp" | "email";
