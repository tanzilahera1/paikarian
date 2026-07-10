import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { redirect } from "next/navigation";
import { IProduct } from "@/types/product";
import AdminProductsClient from "./AdminProductsClient";

export const metadata = {
  title: "Manage Products | Admin",
};

async function getProducts(): Promise<IProduct[]> {
  await dbConnect();
  Category.init();

  const products = await Product.find()
    .populate({ path: "category", select: "name slug" })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const products = await getProducts();

  return <AdminProductsClient initialProducts={products} />;
}
