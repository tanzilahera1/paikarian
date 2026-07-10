import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Brand from "@/models/Brand";
import { redirect } from "next/navigation";
import AdminBrandsClient from "./AdminBrandsClient";

export const metadata = {
  title: "Manage Brands | Admin",
};

async function getBrands() {
  await dbConnect();

  const brands = await Brand.find().sort({ name: 1 }).lean();

  return JSON.parse(JSON.stringify(brands));
}

export default async function AdminBrandsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const brands = await getBrands();

  return <AdminBrandsClient initialBrands={brands} />;
}
