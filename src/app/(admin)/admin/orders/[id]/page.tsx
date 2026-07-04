// src/app/admin/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { OrderDetailsClient } from "./OrderDetailsClient";
import type { IOrderSerializable } from "@/types/order";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Order Details",
};

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;

  await dbConnect();
  const orderDoc = await Order.findById(id).lean();

  if (!orderDoc) {
    notFound();
  }

  const order = JSON.parse(JSON.stringify(orderDoc)) as IOrderSerializable;

  return <OrderDetailsClient order={order} />;
}