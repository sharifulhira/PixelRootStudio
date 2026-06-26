import { InvoiceForm } from "@/components/admin/invoice-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ fromBooking?: string }>;
}) {
  const params = await searchParams;
  const fromBookingId = params.fromBooking ? parseInt(params.fromBooking) : undefined;
  return <InvoiceForm fromBookingId={fromBookingId} />;
}
