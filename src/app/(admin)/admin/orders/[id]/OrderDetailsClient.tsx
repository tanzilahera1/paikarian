"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Tag, Divider, Typography, Tooltip, message, Row, Col } from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  CreditCardOutlined,
  UserOutlined,
  GiftOutlined,
  CalendarOutlined,
  NumberOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { formatPrice } from "@/lib/priceUtils";
import { StatusUpdater } from "./StatusUpdater";
import type { IOrderSerializable } from "@/types/order";

const { Text, Title } = Typography;

interface Props {
  order: IOrderSerializable;
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "warning",
  confirmed: "processing",
  processing: "processing",
  shipped: "cyan",
  delivered: "success",
  cancelled: "error",
  returned: "default",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "default",
};

export function OrderDetailsClient({ order }: Props) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const isGiftOrder = order.customerPhone !== order.shipping.phone;

  const dateStr = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const totalItems = order.items.reduce(
    (sum, item) => sum + item.itemQuantity,
    0
  );

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    messageApi.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen pb-32 lg:pb-12">
      {contextHolder}
      
      {/* ============ Sticky Header ============ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Button
              type="text"
              icon={<ArrowLeftOutlined className="text-lg" />}
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200"
            />
            <div className="min-w-0">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-0.5">
                Order Details
              </Text>
              <Title level={4} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }} className="truncate">
                {order.orderNumber}
              </Title>
            </div>
          </div>

          <Link
            href={`/admin/orders/${order._id}/invoice`}
            target="_blank"
            rel="noopener"
            className="hidden sm:block"
          >
            <Button type="primary" icon={<PrinterOutlined />} className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl h-10 px-5 shadow-sm">
              Print Invoice
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* ============ Status Hero Card ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <InboxOutlined className="text-3xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Tag color={ORDER_STATUS_COLORS[order.orderStatus] || "default"} className="uppercase text-[10px] font-black tracking-wider border-none m-0 px-2 py-0.5">
                    {order.orderStatus}
                  </Tag>
                  <Tag color={PAYMENT_STATUS_COLORS[order.paymentStatus] || "default"} className="uppercase text-[10px] font-black tracking-wider border-none m-0 px-2 py-0.5">
                    Payment: {order.paymentStatus}
                  </Tag>
                  {isGiftOrder && (
                    <Tag color="magenta" icon={<GiftOutlined />} className="uppercase text-[10px] font-black tracking-wider border-none m-0 px-2 py-0.5">
                      Gift
                    </Tag>
                  )}
                </div>
                <Text className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <CalendarOutlined />
                  {dateStr}
                </Text>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                Total Amount
              </Text>
              <Text className="text-2xl sm:text-3xl font-black text-slate-900 leading-none block">
                {formatPrice(order.total)}
              </Text>
            </div>
          </div>

          <Divider className="my-5 bg-slate-100" />
          <div className="flex items-center gap-4">
             <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status:</Text>
             <StatusUpdater orderId={order._id.toString()} currentStatus={order.orderStatus} />
          </div>
        </div>

        {/* ============ Main Grid ============ */}
        <Row gutter={[24, 24]}>
          {/* ============ Left: Items + Notes ============ */}
          <Col xs={24} lg={16} className="space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <InboxOutlined className="text-blue-600" />
                  <Text className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Items ({order.items.length})
                  </Text>
                </div>
                <Tag className="m-0 bg-white border-slate-200 text-slate-600 font-bold">
                  Qty: {totalItems}
                </Tag>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 flex gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <ProgressiveImage
                          src={item.productImage}
                          alt={item.productTitle}
                          fill
                          sizes="80px"
                          className="object-cover"
                          aspectClass=""
                          containerClassName="absolute inset-0"
                          fallbackIconSize="text-2xl"
                        />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link
                        href={`/products/category/${item.productSlug}`} // Using generic category since it's not stored in order items
                        target="_blank"
                        className="text-sm sm:text-base font-bold leading-snug text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 inline-flex items-start gap-1.5"
                      >
                        {item.productTitle}
                        <ExportOutlined className="text-[10px] mt-1 opacity-40" />
                      </Link>
                      <Text className="text-[11px] text-slate-400 font-mono mt-1 mb-2 block">
                        SKU: {item.productSku}
                      </Text>
                      <div className="flex items-center gap-2">
                        <Tag className="m-0 bg-slate-100 border-none text-slate-700 font-bold text-xs">
                          {formatPrice(item.unitPrice)} × {item.itemQuantity}
                        </Tag>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center">
                      <Text className="text-base sm:text-lg font-black text-slate-900">
                        {formatPrice(item.unitPrice * item.itemQuantity)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <Text className="text-slate-500 font-medium">Subtotal</Text>
                  <Text className="font-bold text-slate-700">
                    {formatPrice(order.subtotal)}
                  </Text>
                </div>
                <div className="flex justify-between text-sm">
                  <Text className="text-slate-500 font-medium">Shipping</Text>
                  <Text className="font-bold text-slate-700">
                    {formatPrice(order.shippingCost)}
                  </Text>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <Text className="text-slate-500 font-medium">Discount</Text>
                    <Text className="font-bold text-emerald-600">
                      -{formatPrice(order.discount)}
                    </Text>
                  </div>
                )}
                <Divider className="my-3 border-slate-200" />
                <div className="flex justify-between items-end">
                  <Text className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Customer Payable
                  </Text>
                  <Text className="text-2xl font-black text-blue-600 leading-none">
                    {formatPrice(order.total)}
                  </Text>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FileTextOutlined className="text-amber-600 text-lg" />
                  <Text className="text-xs font-black uppercase tracking-widest text-amber-900">
                    Customer Note
                  </Text>
                </div>
                <Text className="text-sm text-amber-900 leading-relaxed block font-medium">
                  {order.customerNotes}
                </Text>
              </div>
            )}
          </Col>

          {/* ============ Right: Customer & Payment ============ */}
          <Col xs={24} lg={8} className="space-y-6">
            {/* Customer / Shipping */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <UserOutlined className="text-blue-600" />
                <Text className="text-sm font-black uppercase tracking-widest text-slate-800">
                  {isGiftOrder ? "Delivery To" : "Customer"}
                </Text>
              </div>

              <div className="p-5 space-y-4">
                <InfoRow
                  icon={<UserOutlined />}
                  label="Name"
                  value={order.shipping.name}
                />
                <InfoRow
                  icon={<PhoneOutlined />}
                  label="Phone"
                  value={order.shipping.phone}
                  copyable
                  onCopy={() => handleCopy(order.shipping.phone, "ship-phone")}
                  copied={copiedField === "ship-phone"}
                  href={`tel:${order.shipping.phone}`}
                />
                <InfoRow
                  icon={<EnvironmentOutlined />}
                  label="Address"
                  value={
                    <>
                      {order.shipping.addressLine1}
                      {order.shipping.addressLine2 && (
                        <>, {order.shipping.addressLine2}</>
                      )}
                      {order.shipping.district && (
                        <>
                          <br />
                          <span className="text-slate-500 mt-1 block">
                            {order.shipping.district}
                            {order.shipping.city && `, ${order.shipping.city}`}
                            {order.shipping.postalCode && ` - ${order.shipping.postalCode}`}
                          </span>
                        </>
                      )}
                    </>
                  }
                />
              </div>

              {isGiftOrder && (
                <>
                  <div className="px-5 py-3 border-y border-pink-100 bg-pink-50/50 flex items-center gap-2">
                    <GiftOutlined className="text-pink-600" />
                    <Text className="text-sm font-black uppercase tracking-widest text-pink-900">
                      Order Placed By
                    </Text>
                  </div>
                  <div className="p-5 space-y-4">
                    <InfoRow
                      icon={<PhoneOutlined />}
                      label="Customer Phone"
                      value={order.customerPhone}
                      copyable
                      onCopy={() => handleCopy(order.customerPhone, "cust-phone")}
                      copied={copiedField === "cust-phone"}
                      href={`tel:${order.customerPhone}`}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <CreditCardOutlined className="text-blue-600" />
                <Text className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Payment
                </Text>
              </div>

              <div className="p-5 space-y-4">
                <InfoRow
                  icon={<CreditCardOutlined />}
                  label="Method"
                  value={
                    order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentProvider?.toUpperCase() || "Mobile Payment"
                  }
                />

                {order.paymentMethod === "mobile" && (
                  <>
                    {order.senderNumber && (
                      <InfoRow
                        icon={<PhoneOutlined />}
                        label="Sender"
                        value={order.senderNumber}
                        copyable
                        onCopy={() => handleCopy(order.senderNumber!, "sender")}
                        copied={copiedField === "sender"}
                      />
                    )}
                    {order.transactionId && (
                      <InfoRow
                        icon={<NumberOutlined />}
                        label="TrxID"
                        value={
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                            {order.transactionId}
                          </span>
                        }
                        copyable
                        onCopy={() => handleCopy(order.transactionId!, "trx")}
                        copied={copiedField === "trx"}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <CalendarOutlined className="text-blue-600" />
                <Text className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Timeline
                </Text>
              </div>
              <div className="p-5 space-y-3">
                <TimelineRow label="Order Placed" date={order.createdAt} />
                {order.paidAt && (
                  <TimelineRow label="Payment Received" date={order.paidAt} />
                )}
                {order.shippedAt && (
                  <TimelineRow label="Shipped" date={order.shippedAt} />
                )}
                {order.deliveredAt && (
                  <TimelineRow label="Delivered" date={order.deliveredAt} />
                )}
                {order.cancelledAt && (
                  <TimelineRow
                    label="Cancelled"
                    date={order.cancelledAt}
                    danger
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ============ Mobile Sticky Bottom Bar ============ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2">
          <a href={`tel:${order.shipping.phone}`} className="flex-1">
            <Button size="large" icon={<PhoneOutlined />} className="w-full font-bold">
              Call
            </Button>
          </a>
          <Link
            href={`/admin/orders/${order._id}/invoice`}
            target="_blank"
            rel="noopener"
            className="flex-1"
          >
            <Button type="primary" size="large" icon={<PrinterOutlined />} className="w-full bg-slate-900 hover:bg-slate-800 font-bold">
              Invoice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============ Sub Components ============ */

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  href?: string;
}

function InfoRow({
  icon,
  label,
  value,
  copyable,
  onCopy,
  copied,
  href,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
          {label}
        </Text>
        <div className="text-sm leading-snug break-words">
          {href ? (
            <a
              href={href}
              className="text-slate-800 font-bold hover:text-blue-600 transition-colors"
            >
              {value}
            </a>
          ) : (
            <span className="text-slate-800 font-bold">{value}</span>
          )}
        </div>
      </div>
      {copyable && onCopy && (
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <Button
            type="text"
            icon={copied ? <CheckOutlined className="text-emerald-500" /> : <CopyOutlined className="text-slate-400" />}
            onClick={onCopy}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-slate-100"
          />
        </Tooltip>
      )}
    </div>
  );
}

interface TimelineRowProps {
  label: string;
  date: string | Date;
  danger?: boolean;
}

function TimelineRow({ label, date, danger }: TimelineRowProps) {
  const d = new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <Text
        className={`text-xs font-bold uppercase tracking-wider ${
          danger ? "text-rose-500" : "text-slate-500"
        }`}
      >
        {label}
      </Text>
      <Text className="text-slate-700 font-medium font-mono text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
        {d}
      </Text>
    </div>
  );
}