"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// ✅ Bengali-safe slug generator
// বাংলা বা অন্য non-ASCII অক্ষর থাকলে শুধু timestamp-ভিত্তিক slug তৈরি হবে।
// English মিশ্রিত হলে English অংশ ব্যবহার হবে।
function generateSlug(title: string): string {
  const suffix = Date.now().toString().slice(-6);

  // ASCII/English অংশ বের করো
  const asciiPart = title
    .toLowerCase()
    .replace(/[\u0980-\u09FF]/g, " ") // বাংলা অক্ষর → space
    .replace(/[^a-z0-9\s]/g, "")      // অন্য non-alphanumeric → সরাও
    .trim()
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/^-+|-+$/g, "");         // leading/trailing hyphens সরাও

  // যদি English অংশ অর্থবহ না হয় (খুব ছোট বা খালি), শুধু timestamp ব্যবহার করো
  const base = asciiPart.length >= 3 ? asciiPart : "product";

  return `${base}-${suffix}`;
}

export async function createProduct(data: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await dbConnect();

    // URL গুলো proper image schema array-এ convert করো
    let images: { url: string; alt: string; order: number }[] = [];
    if (data.images && Array.isArray(data.images)) {
      images = data.images
        .filter((url: string) => url.trim() !== "")
        .map((url: string, index: number) => ({
          url,
          alt: `${data.title as string} - Image ${index + 1}`,
          order: index,
        }));
    }

    const slug = generateSlug(data.title as string);

    const newProduct = new Product({
      ...data,
      images,
      slug,
    });

    await newProduct.save();

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, productId: newProduct._id.toString() };
  } catch (error) {
    console.error("Failed to create product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await dbConnect();

    // URL গুলো proper image schema array-এ convert করো
    let images: { url: string; alt: string; order: number }[] = [];
    if (data.images && Array.isArray(data.images)) {
      images = data.images
        .filter((url: string) => url.trim() !== "")
        .map((url: string, index: number) => ({
          url,
          alt: `${data.title as string} - Image ${index + 1}`,
          order: index,
        }));
    }

    // ✅ Title পরিবর্তন হলে slug-ও নতুন করে তৈরি হবে
    const existingProduct = await Product.findById(id).select("title");
    const titleChanged =
      existingProduct &&
      existingProduct.title !== (data.title as string);

    const updatedData: Record<string, unknown> = {
      ...data,
      images,
    };

    if (titleChanged) {
      updatedData.slug = generateSlug(data.title as string);
    }

    await Product.findByIdAndUpdate(id, updatedData);

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}
