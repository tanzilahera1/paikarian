// Server Component — AntdRegistry এখানে থাকায় SSR-এ Antd CSS সঠিকভাবে inject হবে
import "@/styles/antd.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AdminShell from "./AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <AdminShell>{children}</AdminShell>
    </AntdRegistry>
  );
}
