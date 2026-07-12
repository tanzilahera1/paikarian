"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Layout, Menu, Button, ConfigProvider } from "antd";
import {
  MenuOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SettingOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import UserMenuButton from "@/components/layout/UserMenuButton";
import { signOut } from "next-auth/react";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: <Link href="/admin">Dashboard</Link> },
  { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: <Link href="/admin/orders">Orders</Link> },
  { key: "/admin/products", icon: <AppstoreOutlined />, label: <Link href="/admin/products">Products</Link> },
  { key: "/admin/categories", icon: <AppstoreOutlined />, label: <Link href="/admin/categories">Categories</Link> },
  { key: "/admin/brands", icon: <TagsOutlined />, label: <Link href="/admin/brands">Brands</Link> },
  { key: "/admin/settings", icon: <SettingOutlined />, label: <Link href="/admin/settings">Settings</Link> },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const selectedKey = menuItems.find(
    (item) => item.key === pathname || (item.key !== "/admin" && pathname.startsWith(item.key))
  )?.key || "/admin";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
          fontFamily: "inherit",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f8fafc",
        },
        components: {
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#eff6ff",
            itemSelectedColor: "#2563eb",
            itemActiveBg: "#f1f5f9",
            itemBorderRadius: 8,
          },
          Layout: {
            headerBg: "#ffffff",
            headerPadding: "0 16px",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar (Desktop) */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="80"
          onBreakpoint={(broken) => setCollapsed(broken)}
          className="hidden lg:block border-r border-slate-200"
          theme="light"
          style={{ position: "sticky", top: 0, height: "100vh", zIndex: 100 }}
        >
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-center border-b border-slate-100">
              <Link href="/admin" className="flex items-center gap-2 px-4 w-full">
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
                {!collapsed && <span className="font-black text-sm uppercase tracking-wider text-slate-800">Paikarian</span>}
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                className="border-none bg-transparent"
              />
            </div>

            <div className="p-4 border-t border-slate-100">
              <Button
                type="text"
                block
                icon={<LogoutOutlined />}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                {!collapsed && <span>Logout</span>}
              </Button>
            </div>
          </div>
        </Sider>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl flex flex-col`}
        >
          <div className="h-16 flex items-center border-b border-slate-100 px-6">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain mr-3" />
            <span className="font-black text-sm uppercase tracking-wider text-slate-800">Paikarian</span>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              onClick={() => setMobileMenuOpen(false)}
              className="border-none"
            />
          </div>
          <div className="p-4 border-t border-slate-100">
            <Button
              type="text"
              block
              icon={<LogoutOutlined />}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            >
              <span>Logout</span>
            </Button>
          </div>
        </div>

        <Layout className="site-layout transition-all duration-300">
          <Header className="sticky top-0 z-30 flex items-center justify-between shadow-sm border-b border-slate-200 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<MenuOutlined className="text-lg" />}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileMenuOpen(true);
                  } else {
                    setCollapsed(!collapsed);
                  }
                }}
                className="hover:bg-slate-100 rounded-xl w-10 h-10 flex items-center justify-center -ml-2 text-slate-600"
              />
              <Link href="/" className="hidden sm:flex items-center text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                <ArrowLeftOutlined className="mr-1" /> Back to Store
              </Link>
            </div>

            <div className="flex items-center">
              <UserMenuButton />
            </div>
          </Header>

          <Content className="m-0 p-3 sm:p-5 lg:p-6 overflow-x-hidden min-h-[calc(100vh-64px)] relative">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
