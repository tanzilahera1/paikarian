'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { dbConnect } from '@/lib/db'
import Cart from '@/models/Cart'
import Product from '@/models/Product'
import { auth } from '@/auth'
import type { ICartItem } from '@/types/cart'

// Quantity schema — server-side MOQ validation হবে product fetch করার পরে
const AddToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  itemQuantity: z.number().min(1),
})

const UpdateQtySchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  itemQuantity: z.number().min(0), // 0 = remove intent (কার্টের UI থেকে decrement)
})

const RemoveFromCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
})

// --- Internal Helper ---
async function getCart() {
  await dbConnect()
  const session = await auth()
  const { getOrCreateSessionId } = await import('@/lib/session')

  if (session?.user?.id) {
    let cart = await Cart.findOne({ user: session.user.id })
    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] })
    }
    return cart
  } else {
    const guestSessionId = await getOrCreateSessionId()
    let cart = await Cart.findOne({ sessionId: guestSessionId })
    if (!cart) {
      cart = new Cart({ sessionId: guestSessionId, items: [] })
    }
    return cart
  }
}

// --- Variant Stock Resolver ---
// variant থাকলে variant-এর stockQuantity, না থাকলে product-এর stockQuantity
function resolveAvailableStock(
  product: {
    stockQuantity: number
    variants?: Array<{ _id: { toString(): string }; stockQuantity: number }>
  },
  variantId?: string,
): number {
  if (variantId && product.variants && product.variants.length > 0) {
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId,
    )
    if (variant) return variant.stockQuantity
  }
  return product.stockQuantity
}

export async function addToCart(formData: FormData) {
  const validated = AddToCartSchema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
    itemQuantity: Number(formData.get('itemQuantity') || 1),
  })

  if (!validated.success) {
    return { success: false, error: 'ইনপুট ডেটা সঠিক নয়', details: validated.error.flatten() }
  }

  const { productId, variantId, itemQuantity } = validated.data

  await dbConnect()
  const product = await Product.findById(productId)
  if (!product || product.status !== 'published') {
    return { success: false, error: 'পণ্যটি পাওয়া যাচ্ছে না অথবা উপলব্ধ নয়' }
  }

  // ✅ Server-side MOQ enforcement
  const moq = product.moq || 1
  if (itemQuantity < moq) {
    return {
      success: false,
      error: `সর্বনিম্ন অর্ডার পরিমাণ (MOQ) হলো ${moq} পিস`,
    }
  }

  // ✅ Variant-aware stock check
  const availableStock = resolveAvailableStock(product, variantId)
  if (availableStock < itemQuantity) {
    return { success: false, error: `দুঃখিত! পর্যাপ্ত স্টক নেই। স্টকে আছে ${availableStock} পিস।` }
  }

  const cart = await getCart()
  if (!cart) return { success: false, error: 'কার্ট তৈরি করা সম্ভব হয়নি' }

  const existingItemIndex = cart.items.findIndex(
    (item: ICartItem) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  )

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].itemQuantity + itemQuantity
    if (availableStock < newQty) {
      return {
        success: false,
        error: `স্টক লিমিট অতিক্রম হয়েছে! সর্বোচ্চ ${availableStock} পিস যোগ করা যাবে।`,
      }
    }
    cart.items[existingItemIndex].itemQuantity = newQty
  } else {
    cart.items.push({
      product: productId,
      variant: variantId,
      itemQuantity,
      addedAt: new Date(),
    })
  }

  await cart.save()
  return { success: true }
}

export async function updateQty(formData: FormData) {
  const validated = UpdateQtySchema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
    itemQuantity: Number(formData.get('itemQuantity')),
  })

  if (!validated.success) {
    return { success: false, error: 'ইনপুট ডেটা সঠিক নয়' }
  }

  const { productId, variantId, itemQuantity } = validated.data

  await dbConnect()

  const product = await Product.findById(productId).select('stockQuantity moq variants')
  if (!product) {
    return { success: false, error: 'পণ্যটি পাওয়া যাচ্ছে না' }
  }

  // ✅ Variant-aware stock check
  const availableStock = resolveAvailableStock(product, variantId)
  const moq = product.moq || 1

  // itemQuantity === 0 মানে remove করার intent (UI থেকে last step-এ remove হয়)
  if (itemQuantity !== 0 && itemQuantity < moq) {
    return {
      success: false,
      error: `সর্বনিম্ন পরিমাণ (MOQ) ${moq} পিস হতে হবে`,
    }
  }

  if (itemQuantity > availableStock) {
    return {
      success: false,
      error: `সর্বোচ্চ স্টক লিমিট ${availableStock} পিস`,
    }
  }

  const cart = await getCart()
  if (!cart) return { success: false, error: 'কার্ট খুঁজে পাওয়া যায়নি' }

  const existingItemIndex = cart.items.findIndex(
    (item: ICartItem) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  )

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].itemQuantity = itemQuantity
    await cart.save()
  }

  return { success: true }
}

export async function removeFromCart(formData: FormData) {
  const validated = RemoveFromCartSchema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId') || undefined,
  })

  if (!validated.success) return { error: 'ইনপুট ডেটা সঠিক নয়' }

  const cart = await getCart()
  if (!cart) return { error: 'কার্ট খুঁজে পাওয়া যায়নি' }

  const { productId, variantId } = validated.data
  cart.items = cart.items.filter(
    (item: ICartItem) =>
      !(
        item.product.toString() === productId &&
        item.variant?.toString() === variantId
      ),
  )

  await cart.save()
  return { success: true }
}

export async function mergeGuestCartToUser(userId?: string) {
  let finalUserId = userId
  if (!finalUserId) {
    const session = await auth()
    finalUserId = session?.user?.id
  }

  if (!finalUserId) return { success: false, error: 'User ID পাওয়া যায়নি' }

  await dbConnect()
  const cookieStore = await cookies()
  const guestSessionId = cookieStore.get('cart_session_id')?.value
  if (!guestSessionId) return { success: true }

  const [guestCart, userCart] = await Promise.all([
    Cart.findOne({ sessionId: guestSessionId }),
    Cart.findOne({ user: finalUserId }),
  ])

  if (!guestCart || guestCart.items.length === 0) return { success: true }

  if (!userCart) {
    guestCart.user = finalUserId
    guestCart.sessionId = undefined
    try {
      await guestCart.save()
      cookieStore.delete('cart_session_id')
    } catch {}
    return { success: true }
  }

  for (const guestItem of guestCart.items) {
    const existingItemIndex = userCart.items.findIndex(
      (item: ICartItem) =>
        item.product.toString() === guestItem.product.toString() &&
        item.variant?.toString() === guestItem.variant?.toString(),
    )

    if (existingItemIndex > -1) {
      const product = await Product.findById(guestItem.product).select(
        'stockQuantity moq variants',
      )
      const availableStock = resolveAvailableStock(
        product,
        guestItem.variant?.toString(),
      )
      const newQty =
        userCart.items[existingItemIndex].itemQuantity + guestItem.itemQuantity
      userCart.items[existingItemIndex].itemQuantity = Math.min(
        newQty,
        availableStock || newQty,
      )
    } else {
      const product = await Product.findById(guestItem.product).select(
        'status stockQuantity moq variants',
      )
      const availableStock = resolveAvailableStock(
        product,
        guestItem.variant?.toString(),
      )
      if (product && product.status === 'published' && availableStock > 0) {
        userCart.items.push(guestItem)
      }
    }
  }

  await userCart.save()
  await Cart.deleteOne({ _id: guestCart._id })
  try {
    cookieStore.delete('cart_session_id')
  } catch {}
  return { success: true }
}