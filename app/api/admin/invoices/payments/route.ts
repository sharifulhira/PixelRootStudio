import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordPayment, deletePayment, getPaymentsForInvoice } from "@/lib/invoices/payments";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoiceId = new URL(request.url).searchParams.get("invoiceId");
    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
    }

    const payments = getPaymentsForInvoice(parseInt(invoiceId));
    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const invoiceId = data.invoiceId;
    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
    }

    const result = recordPayment(parseInt(invoiceId), {
      amount: parseFloat(data.amount),
      paymentDate: data.paymentDate,
      method: data.method,
      reference: data.reference,
      notes: data.notes,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record payment" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentId = new URL(request.url).searchParams.get("id");
    if (!paymentId) {
      return NextResponse.json({ error: "Payment id required" }, { status: 400 });
    }

    const result = deletePayment(parseInt(paymentId));
    if (!result) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
