"use client";

import React, { useState } from "react";
import { Table, Input, Button, Tag, Space, Typography, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { SearchOutlined, FilterOutlined, ExportOutlined, EyeOutlined, DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { IOrder } from "@/types/order";
import { updateOrderStatus } from "@/actions/order";

const { Text, Title } = Typography;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "confirmed", label: "Confirmed", color: "processing" },
  { value: "processing", label: "Processing", color: "processing" },
  { value: "shipped", label: "Shipped", color: "cyan" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "error" },
  { value: "returned", label: "Returned", color: "default" },
];

export default function AdminOrdersClient({ initialOrders }: { initialOrders: IOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o: IOrder) => (o._id!.toString() === orderId ? ({ ...o, orderStatus: newStatus } as IOrder) : o))
        );
        messageApi.success(`Status updated to ${newStatus}`);
      } else {
        messageApi.error(res.error || "Failed to update status");
      }
    } catch {
      messageApi.error("Something went wrong");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shipping?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shipping?.phone?.includes(searchText)
  );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text: string, record: IOrder) => (
        <Link href={`/admin/orders/${record._id}`} className="font-bold text-blue-600 tracking-tight hover:underline">
          #{text}
        </Link>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: unknown, record: IOrder) => (
        <div className="flex flex-col">
          <Text className="font-bold text-slate-800">{record.shipping.name}</Text>
          <Text className="text-[11px] text-slate-500">{record.shipping.phone}</Text>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="flex flex-col">
          <Text className="text-xs font-bold text-slate-600">{dayjs(date).format("DD MMM, YYYY")}</Text>
          <Text className="text-[10px] text-slate-400">{dayjs(date).format("hh:mm A")}</Text>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <Text className="font-black text-slate-900 tracking-tight">৳{total.toLocaleString()}</Text>,
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => (
        <Tag color={method === "cod" ? "default" : "blue"} className="uppercase font-bold text-[9px] tracking-wider m-0">
          {method}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: IOrder) => {
        const currentOption = STATUS_OPTIONS.find((opt) => opt.value === record.orderStatus) || STATUS_OPTIONS[0];
        const menuItems: MenuProps["items"] = STATUS_OPTIONS.map(opt => ({
          key: opt.value,
          label: (
            <Tag color={opt.color} className="uppercase font-bold text-[10px] tracking-wider border-none">
              {opt.label}
            </Tag>
          ),
          onClick: () => handleStatusChange(record._id!.toString(), opt.value),
        }));
        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Tag
              color={currentOption.color}
              className="uppercase font-bold text-[10px] tracking-wider border-none cursor-pointer select-none"
              style={{ userSelect: "none" }}
            >
              {currentOption.label} <DownOutlined style={{ fontSize: 8 }} />
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: IOrder) => (
        <Link href={`/admin/orders/${record._id}`}>
          <Button type="text" icon={<EyeOutlined />} size="small" className="text-slate-400 hover:text-blue-600" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Orders
          </Title>
          <Text type="secondary" className="font-medium">Track and manage all customer purchases.</Text>
        </div>
        <Tag color="warning" className="px-3 py-1 font-bold rounded-full border-none">
          {orders.filter(o => o.orderStatus === "pending").length} Pending
        </Tag>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <Input
          placeholder="Search by Order ID, Name or Phone..."
          prefix={<SearchOutlined className="text-slate-400" />}
          className="flex-1 rounded-xl h-10 border-slate-200"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Space>
          <Button icon={<FilterOutlined />} className="rounded-xl h-10 px-4 font-semibold text-slate-600 border-slate-200">
            Filter
          </Button>
          <Button type="primary" icon={<ExportOutlined />} className="rounded-xl h-10 px-4 font-bold bg-slate-900 hover:bg-slate-800">
            Export
          </Button>
        </Space>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 15, showSizeChanger: false, placement: ["bottomCenter"] }}
            className="custom-table-no-border"
            size="middle"
          />
        </div>

        {/* Mobile View List */}
        <div className="block md:hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-500">No orders found.</Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const currentOption = STATUS_OPTIONS.find((opt) => opt.value === order.orderStatus) || STATUS_OPTIONS[0];

                return (
                  <div key={order._id?.toString()} className="py-4 px-4 first:pt-4 last:pb-4 space-y-3">
                    {/* Header: ID + Status Select */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link href={`/admin/orders/${order._id}`} className="font-bold text-blue-600 hover:text-blue-700 block">
                          #{order.orderNumber}
                        </Link>
                        <Text className="text-xs text-slate-500">{dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}</Text>
                      </div>
                      
                      <Dropdown
                        menu={{
                          items: STATUS_OPTIONS.map(opt => ({
                            key: opt.value,
                            label: (
                              <Tag color={opt.color} className="uppercase font-bold text-[10px] tracking-wider border-none">
                                {opt.label}
                              </Tag>
                            ),
                            onClick: () => handleStatusChange(order._id!.toString(), opt.value),
                          }))
                        }}
                        trigger={["click"]}
                      >
                        <Tag
                          color={currentOption.color}
                          className="uppercase font-bold text-[10px] tracking-wider border-none cursor-pointer"
                        >
                          {currentOption.label} <DownOutlined style={{ fontSize: 8 }} />
                        </Tag>
                      </Dropdown>
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Customer</Text>
                        <Text className="text-xs font-semibold text-slate-700 block">{order.shipping.name}</Text>
                        <Text className="text-[10px] text-slate-500 block">{order.shipping.phone}</Text>
                      </div>
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Total</Text>
                        <Text className="text-sm font-black text-slate-900 block">৳{order.total.toLocaleString()}</Text>
                        <Tag color={order.paymentMethod === "cod" ? "default" : "blue"} className="uppercase font-bold text-[9px] tracking-wider m-0 mt-1">
                          {order.paymentMethod}
                        </Tag>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end mt-2">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button size="small" icon={<EyeOutlined />} className="text-xs font-medium text-slate-600">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
