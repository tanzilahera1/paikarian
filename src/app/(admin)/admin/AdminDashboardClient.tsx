"use client";

import React from "react";
import { Card, Row, Col, Statistic, Table, Tag, Typography } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import type { IOrder } from "@/types/order";

const { Title, Text } = Typography;

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalSales: number;
  recentOrders: IOrder[];
}

export default function AdminDashboardClient({ stats }: { stats: DashboardStats }) {
  const recentColumns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text: string, record: IOrder) => (
        <Link href={`/admin/orders/${record._id}`} className="font-bold text-blue-600 hover:text-blue-700 transition-colors tracking-tight">
          {text}
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => <Text className="text-xs text-slate-500 font-medium">{dayjs(date).format("DD MMM YYYY")}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IOrder) => (
        <div className="flex flex-col">
          <Text className="font-bold text-slate-800">{record.shipping.name}</Text>
          <Text className="text-[11px] text-slate-500">{record.shipping.phone}</Text>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <Text className="font-bold">৳{total.toLocaleString()}</Text>,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => {
        let color = "blue";
        if (status === "pending") color = "warning";
        if (status === "processing") color = "processing";
        if (status === "shipped") color = "cyan";
        if (status === "delivered") color = "success";
        if (status === "cancelled") color = "error";
        
        return (
          <Tag color={color} className="uppercase text-[10px] font-black tracking-[0.05em] m-0 border-none px-2 py-0.5 rounded-md">
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Overview</Title>
        <Text type="secondary" className="font-medium">Here's what's happening with Paikarian today.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <DollarOutlined style={{ fontSize: 120 }} />
            </div>
            <Statistic
              title={<span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Total Sales</span>}
              value={stats.totalSales}
              precision={0}
              prefix="৳"
              styles={{ content: { fontWeight: 900, color: "#10b981", fontSize: "28px", letterSpacing: "-0.02em" } }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <ShoppingCartOutlined style={{ fontSize: 120 }} />
            </div>
            <Statistic
              title={<span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Total Orders</span>}
              value={stats.totalOrders}
              styles={{ content: { fontWeight: 900, color: "#2563eb", fontSize: "28px", letterSpacing: "-0.02em" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden relative bg-amber-50/50 group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none text-amber-500">
              <ClockCircleOutlined style={{ fontSize: 120 }} />
            </div>
            <Statistic
              title={<span className="text-amber-600 font-bold uppercase tracking-wider text-[11px]">Pending Orders</span>}
              value={stats.pendingOrders}
              styles={{ content: { fontWeight: 900, color: "#d97706", fontSize: "28px", letterSpacing: "-0.02em" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <AppstoreOutlined style={{ fontSize: 120 }} />
            </div>
            <Statistic
              title={<span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Products</span>}
              value={stats.totalProducts}
              styles={{ content: { fontWeight: 900, color: "#6366f1", fontSize: "28px", letterSpacing: "-0.02em" } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card 
            title={<span className="font-black text-slate-800 text-lg">Recent Orders</span>} 
            variant="borderless" 
            className="shadow-sm rounded-2xl overflow-hidden"
            extra={<Link href="/admin/orders" className="text-blue-600 text-xs font-black uppercase tracking-wider hover:text-blue-700 transition-colors flex items-center gap-1">View All <ArrowRightOutlined /></Link>}
            styles={{ body: { padding: 0 } }}
          >
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table 
                dataSource={stats.recentOrders} 
                columns={recentColumns} 
                rowKey="_id"
                pagination={false}
                size="middle"
                className="custom-table-no-border"
              />
            </div>

            {/* Mobile View List */}
            <div className="block md:hidden">
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Text className="text-gray-500">No recent orders.</Text>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => {
                    let color = "blue";
                    if (order.orderStatus === "pending") color = "warning";
                    if (order.orderStatus === "processing") color = "processing";
                    if (order.orderStatus === "shipped") color = "cyan";
                    if (order.orderStatus === "delivered") color = "success";
                    if (order.orderStatus === "cancelled") color = "error";

                    return (
                      <div key={order._id?.toString()} className="py-4 px-4 first:pt-4 last:pb-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/admin/orders/${order._id}`} className="font-bold text-blue-600 hover:text-blue-700 block">
                              #{order.orderNumber}
                            </Link>
                            <Text className="text-xs text-slate-500">{dayjs(order.createdAt).format("DD MMM YYYY")}</Text>
                          </div>
                          <Tag color={color} className="uppercase text-[10px] font-black tracking-[0.05em] m-0 border-none px-2 py-0.5 rounded-md">
                            {order.orderStatus}
                          </Tag>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div>
                            <Text className="text-[10px] uppercase font-bold text-slate-400 block">Customer</Text>
                            <Text className="text-xs font-semibold text-slate-700 block">{order.shipping.name}</Text>
                            <Text className="text-[10px] text-slate-500 block">{order.shipping.phone}</Text>
                          </div>
                          <div>
                            <Text className="text-[10px] uppercase font-bold text-slate-400 block">Total</Text>
                            <Text className="text-sm font-black text-slate-900 block">৳{order.total.toLocaleString()}</Text>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
