"use client";

import React, { useState } from "react";
import { Table, Input, Button, Space, Typography, Tooltip, Modal, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { ICategory } from "@/types/category";
import { deleteCategory } from "@/actions/adminCategories";

const { Text, Title } = Typography;

export default function AdminCategoriesClient({ initialCategories }: { initialCategories: ICategory[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: "Delete Category?",
      icon: <ExclamationCircleOutlined />,
      content: `"${name}" permanently delete হবে। এই কাজ আর পূর্বাবস্থায় ফেরানো যাবে না।`,
      okText: "হ্যাঁ, Delete করো",
      okType: "danger",
      cancelText: "বাতিল",
      onOk: async () => {
        const res = await deleteCategory(id);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c._id?.toString() !== id));
          messageApi.success("Category deleted successfully");
        } else {
          messageApi.error(res.error || "Failed to delete category");
        }
      },
    });
  };

  const columns = [
    {
      title: "Image",
      key: "image",
      width: 80,
      render: (_: unknown, record: ICategory) => (
        <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
          {record.image ? (
            <Image src={record.image} alt={record.name} fill className="object-contain" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
              {record.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      key: "categoryInfo",
      render: (_: unknown, record: ICategory) => (
        <div className="flex flex-col max-w-[250px]">
          <Link href={`/admin/categories/${record._id}`} className="font-bold text-slate-800 hover:text-blue-600 truncate transition-colors">
            {record.name}
          </Link>
          <Text className="text-[10px] text-slate-500 truncate mt-0.5">{record.description || "No description provided."}</Text>
        </div>
      ),
    },
    {
      title: "SEO Snapshot",
      key: "seoInfo",
      render: (_: unknown, record: ICategory) => (
        <div className="flex flex-col">
          <Text className="text-[11px] font-bold text-slate-600 truncate">Title: {record.name}</Text>
          <Text className="text-[10px] text-slate-400 truncate max-w-[200px]">Desc: {record.description || "None"}</Text>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: ICategory) => (
        <Space size="small">
          <Tooltip title="Edit Category">
            <Link href={`/admin/categories/${record._id}`}>
              <Button type="text" size="small" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100"
              onClick={() => handleDelete(record._id?.toString() || "", record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      {modalContextHolder}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Categories
          </Title>
          <Text type="secondary" className="font-medium">Manage product taxonomy and collections</Text>
        </div>
        <Link href="/admin/categories/new">
          <Button type="primary" icon={<PlusOutlined />} className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl h-10 px-5 shadow-md">
            Add Category
          </Button>
        </Link>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-black text-xs">
            {categories.length}
          </div>
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Categories</Text>
        </div>
        <Input
          placeholder="Search categories..."
          prefix={<SearchOutlined className="text-slate-400" />}
          className="w-full md:w-72 rounded-xl h-10 border-slate-200"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table
            dataSource={filteredCategories}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 15, showSizeChanger: false, placement: ["bottomCenter"] }}
            className="custom-table-no-border"
            size="middle"
          />
        </div>

        {/* Mobile View List */}
        <div className="block md:hidden">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-500">No categories found.</Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCategories.map((cat) => {
                return (
                  <div key={cat._id?.toString()} className="py-4 px-4 first:pt-4 last:pb-4 space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0">
                        {cat.image ? (
                          <Image src={cat.image} alt={cat.name} fill className="object-contain" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/categories/${cat._id}`} className="font-bold text-slate-800 text-sm hover:text-blue-600 truncate block">
                          {cat.name}
                        </Link>
                        <Text className="text-[10px] text-slate-500 truncate block mt-0.5">{cat.description || "No description provided."}</Text>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Tooltip title="Edit Category">
                        <Link href={`/admin/categories/${cat._id}`}>
                          <Button size="small" type="primary" icon={<EditOutlined />} className="text-xs">Edit</Button>
                        </Link>
                      </Tooltip>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="text-xs"
                        onClick={() => handleDelete(cat._id?.toString() || "", cat.name)}
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
