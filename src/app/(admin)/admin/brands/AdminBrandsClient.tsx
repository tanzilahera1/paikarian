"use client";

import React, { useState } from "react";
import { Table, Input, Button, Space, Typography, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Text, Title } = Typography;

export default function AdminBrandsClient({ initialBrands }: { initialBrands: any[] }) {
  const [brands] = useState(initialBrands);
  const [searchText, setSearchText] = useState("");

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchText.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Logo",
      key: "logo",
      width: 80,
      render: (_: any, record: any) => (
        <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
          {record.logo ? (
            <Image
              src={record.logo}
              alt={record.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
              {record.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Brand",
      key: "brandInfo",
      render: (_: any, record: any) => (
        <div className="flex flex-col max-w-[250px]">
          <Link href={`/admin/brands/${record._id}`} className="font-bold text-slate-800 hover:text-blue-600 truncate transition-colors">
            {record.name}
          </Link>
          <Text className="text-[10px] text-slate-500 truncate mt-0.5">{record.description || "No description provided."}</Text>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug: string) => (
        <Text className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{slug}</Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Edit Brand">
            <Link href={`/admin/brands/${record._id}`}>
              <Button type="text" size="small" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" size="small" icon={<DeleteOutlined />} className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Brands
          </Title>
          <Text type="secondary" className="font-medium">Manage product manufacturers and brand collections</Text>
        </div>
        <Link href="/admin/brands/new">
          <Button type="primary" icon={<PlusOutlined />} className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl h-10 px-5 shadow-md">
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-black text-xs">
            {brands.length}
          </div>
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Brands</Text>
        </div>

        <Input
          placeholder="Search brands..."
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
            dataSource={filteredBrands}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 15, showSizeChanger: false, placement: ["bottomCenter"] }}
            className="custom-table-no-border"
            size="middle"
          />
        </div>

        {/* Mobile View List */}
        <div className="block md:hidden">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-500">No brands found.</Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBrands.map((brand) => {
                return (
                  <div key={brand._id?.toString()} className="py-4 px-4 first:pt-4 last:pb-4 space-y-3">
                    {/* Header: Logo + Title */}
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/brands/${brand._id}`} className="font-bold text-slate-800 text-sm hover:text-blue-600 truncate block">
                          {brand.name}
                        </Link>
                        <Text className="text-[10px] text-slate-500 truncate block mt-0.5">{brand.description || "No description provided."}</Text>
                        <Text className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">{brand.slug}</Text>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-1">
                      <Tooltip title="Edit Brand">
                        <Link href={`/admin/brands/${brand._id}`}>
                          <Button size="small" type="primary" icon={<EditOutlined />} className="text-xs">Edit</Button>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button size="small" danger icon={<DeleteOutlined />} className="text-xs">Delete</Button>
                      </Tooltip>
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
