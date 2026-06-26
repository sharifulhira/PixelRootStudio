import { db } from "@/lib/db";
import { invoiceSettings, siteSettings } from "@/lib/db/schema";

export function getInvoiceSettings() {
  let settings = db.select().from(invoiceSettings).get();

  if (!settings) {
    const site = db.select().from(siteSettings).get();
    db.insert(invoiceSettings)
      .values({
        prefix: "INV",
        nextNumber: 1001,
        defaultTaxRate: 0,
        defaultCurrency: "BDT",
        defaultTerms: "Payment due within 7 days of invoice date.",
        companyName: site?.orgName || site?.siteName || "PixelRoot Studio",
        companyEmail: site?.orgEmail || "",
        companyPhone: site?.orgPhone || "",
        companyAddress: site?.orgAddress || "",
        updatedAt: new Date(),
      })
      .run();
    settings = db.select().from(invoiceSettings).get()!;
  }

  return settings;
}

export function getNextInvoiceNumber(): string {
  const settings = getInvoiceSettings();
  const year = new Date().getFullYear();
  const num = settings.nextNumber || 1001;
  const prefix = settings.prefix || "INV";
  return `${prefix}-${year}-${num}`;
}

export function incrementInvoiceNumber() {
  const settings = getInvoiceSettings();
  db.update(invoiceSettings)
    .set({
      nextNumber: (settings.nextNumber || 1001) + 1,
      updatedAt: new Date(),
    })
    .run();
}
