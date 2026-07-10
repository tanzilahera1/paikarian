import Order from "@/models/Order";
import { dbConnect } from "@/lib/db";
import { IOrder } from "@/types/order";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

async function getOrders(): Promise<IOrder[]> {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <AdminOrdersClient initialOrders={orders} />;
}
