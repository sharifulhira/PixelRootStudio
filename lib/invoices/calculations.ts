export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceTotalsInput = {
  items: InvoiceLineItem[];
  taxRate: number;
  discountType: "fixed" | "percent";
  discountValue: number;
};

export type InvoiceTotals = {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  lineAmounts: number[];
};

export function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export function calculateInvoiceTotals(input: InvoiceTotalsInput): InvoiceTotals {
  const lineAmounts = input.items.map((item) =>
    roundMoney((item.quantity || 0) * (item.unitPrice || 0))
  );
  const subtotal = roundMoney(lineAmounts.reduce((s, a) => s + a, 0));

  const discountAmount =
    input.discountType === "percent"
      ? roundMoney(subtotal * ((input.discountValue || 0) / 100))
      : roundMoney(input.discountValue || 0);

  const afterDiscount = Math.max(0, roundMoney(subtotal - discountAmount));
  const taxAmount = roundMoney(afterDiscount * ((input.taxRate || 0) / 100));
  const total = roundMoney(afterDiscount + taxAmount);

  return { subtotal, taxAmount, discountAmount, total, lineAmounts };
}

export function formatMoney(amount: number, currency = "BDT") {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function sumPaymentAmounts(payments: { amount: number }[]) {
  return roundMoney(payments.reduce((sum, p) => sum + (p.amount || 0), 0));
}

export function calculatePaymentSummary(invoiceTotal: number, payments: { amount: number }[]) {
  const amountPaid = sumPaymentAmounts(payments);
  const balanceDue = Math.max(0, roundMoney(invoiceTotal - amountPaid));
  return { amountPaid, balanceDue };
}
