"use client";

import React, { useState } from "react";
import { Table, Input, Button, Tag, Space, Typography, Tooltip, Modal, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/types/product";
import { formatPrice } from "@/lib/priceUtils";
import { deleteProduct } from "@/actions/adminProducts";

const { Text, Title } = Typography;

export default function AdminProductsClient({ initialProducts }: { initialProducts: IProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchText.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    modal.confirm({
      title: "Delete Product?",
      icon: <ExclamationCircleOutlined />,
      content: `"${title}" permanently delete হবে। এই কাজ আর পূর্বাবস্থায় ফেরানো যাবে না।`,
      okText: "হ্যাঁ, Delete করো",
      okType: "danger",
      cancelText: "বাতিল",
      onOk: async () => {
        const res = await deleteProduct(id);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p._id?.toString() !== id));
          messageApi.success("Product deleted successfully");
        } else {
          messageApi.error(res.error || "Failed to delete product");
        }
      },
    });
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_: unknown, record: IProduct) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <Image
              src={record.thumbnail || "/placeholder.png"}
              alt={record.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col max-w-[200px] sm:max-w-[300px]">
            <Link href={`/admin/products/${record._id}`} className="font-bold text-slate-800 hover:text-blue-600 truncate transition-colors">
              {record.title}
            </Link>
            <Text className="text-[10px] text-slate-500 truncate">{record.slug}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: { name?: string }) => (
        <Tag className="rounded-md bg-slate-50 border-slate-200 text-slate-600 m-0">
          {category?.name || "Uncategorized"}
        </Tag>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (_: unknown, record: IProduct) => (
        <div className="flex flex-col">
          <Text className="font-bold text-slate-900 tracking-tight">{formatPrice(record.salePrice || record.regularPrice || 0)}</Text>
          <Text className="text-[10px] text-slate-500 line-through">{record.salePrice ? formatPrice(record.regularPrice) : ""}</Text>
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      render: (stockQuantity: number) => {
        const isLow = stockQuantity < 10;
        const isOut = stockQuantity === 0;
        return (
          <Tag color={isOut ? "error" : isLow ? "warning" : "success"} className="rounded-md font-bold text-[10px] m-0 border-none">
            {isOut ? "OUT OF STOCK" : `${stockQuantity} IN STOCK`}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "published" ? "blue" : "default"} className="uppercase text-[9px] font-black tracking-widest m-0 border-none">
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: IProduct) => (
        <Space size="small">
          <Tooltip title="View Store">
            <Link href={`/products/${(record.category as { slug?: string })?.slug || "uncategorized"}/${record.slug}`} target="_blank">
              <Button type="text" size="small" icon={<EyeOutlined />} className="text-slate-400 hover:text-slate-600" />
            </Link>
          </Tooltip>
          <Tooltip title="Edit Product">
            <Link href={`/admin/products/${record._id}`}>
              <Button type="text" size="small" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100"
              onClick={() => handleDelete(record._id?.toString() || "", record.title)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Products
          </Title>
          <Text type="secondary" className="font-medium">Manage your store catalog and inventory</Text>
        </div>
        <Link href="/admin/products/new">
          <Button type="primary" icon={<PlusOutlined />} className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl h-10 px-5 shadow-md">
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <Space size="large" className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-black text-xs">
              {products.length}
            </div>
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-black text-xs">
              {products.filter(p => p.status === "published").length}
            </div>
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</Text>
          </div>
        </Space>

        <Input
          placeholder="Search products by title or slug..."
          prefix={<SearchOutlined className="text-slate-400" />}
          className="w-full md:w-72 rounded-xl h-10 border-slate-200"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      {contextHolder}
      {modalContextHolder}
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10, showSizeChanger: false, placement: ["bottomCenter"] }}
            className="custom-table-no-border"
            size="middle"
          />
        </div>

        {/* Mobile View List */}
        <div className="block md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-500">No products found.</Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const isLow = product.stockQuantity < 10;
                const isOut = product.stockQuantity === 0;

                return (
                  <div key={product._id?.toString()} className="py-4 px-4 first:pt-4 last:pb-4 space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={product.thumbnail || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/products/${product._id}`} className="font-bold text-slate-800 text-sm hover:text-blue-600 truncate block">
                          {product.title}
                        </Link>
                        <Text className="text-[10px] text-slate-500 truncate block mt-0.5">{product.slug}</Text>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Price</Text>
                        <Text className="text-xs font-bold text-slate-900">{formatPrice(product.salePrice || product.regularPrice || 0)}</Text>
                        {product.salePrice && <Text className="text-[9px] text-slate-500 line-through ml-1">{formatPrice(product.regularPrice)}</Text>}
                      </div>
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Stock</Text>
                        <Tag color={isOut ? "error" : isLow ? "warning" : "success"} className="rounded-md font-bold text-[9px] m-0 border-none mt-0.5">
                          {isOut ? "OUT OF STOCK" : `${product.stockQuantity} IN STOCK`}
                        </Tag>
                      </div>
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Category</Text>
                        <Tag className="rounded-md bg-white border-slate-200 text-slate-600 m-0 text-[9px] mt-0.5">
                          {(product.category as { name?: string })?.name || "Uncategorized"}
                        </Tag>
                      </div>
                      <div>
                        <Text className="text-[10px] uppercase font-bold text-slate-400 block">Status</Text>
                        <Tag color={product.status === "published" ? "blue" : "default"} className="uppercase text-[9px] font-black tracking-widest m-0 border-none mt-0.5">
                          {product.status}
                        </Tag>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Tooltip title="View Store">
                        <Link href={`/products/${(product.category as { slug?: string })?.slug || "uncategorized"}/${product.slug}`} target="_blank">
                          <Button size="small" icon={<EyeOutlined />} className="text-xs text-slate-500">View</Button>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <Link href={`/admin/products/${product._id}`}>
                          <Button size="small" type="primary" icon={<EditOutlined />} className="text-xs">Edit</Button>
                        </Link>
                      </Tooltip>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="text-xs"
                        onClick={() => handleDelete(product._id?.toString() || "", product.title)}
                      >
                        Delete
                      </Button>
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
