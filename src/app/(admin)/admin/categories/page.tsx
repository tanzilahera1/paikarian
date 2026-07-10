import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import { redirect } from "next/navigation";
import { ICategory } from "@/types/category";
import AdminCategoriesClient from "./AdminCategoriesClient";

export const metadata = {
  title: "Manage Categories | Admin",
};

async function getCategories() {
  await dbConnect();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const categories = await getCategories();

  return <AdminCategoriesClient initialCategories={categories} />;
}
