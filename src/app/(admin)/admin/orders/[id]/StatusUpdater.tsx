"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, message, Modal, Tag, Button } from "antd";
import { ExclamationCircleOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { updateOrderStatus } from "@/actions/order";
import type { MenuProps } from "antd";

const STATUS_COLORS: Record<string, string> = {
  pending: "warning",
  confirmed: "processing",
  processing: "processing",
  shipped: "cyan",
  delivered: "success",
  cancelled: "error",
  returned: "default",
};

interface Props {
  orderId: string;
  currentStatus: string;
}

export function StatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const newStatus = e.key;
    if (newStatus === status) return;

    modal.confirm({
      title: "Update Status",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to change the status to "${newStatus}"?`,
      okText: "Yes, update it",
      cancelText: "Cancel",
      onOk: () => {
        startTransition(async () => {
          const res = await updateOrderStatus(orderId, newStatus);
          if (res?.error) {
            messageApi.error(res.error);
          } else {
            setStatus(newStatus);
            messageApi.success(`Status updated to ${newStatus}`);
            router.refresh();
          }
        });
      },
    });
  };

  const items: MenuProps["items"] = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
  ];

  return (
    <>
      {contextHolder}
      {modalContextHolder}
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={["click"]}
        disabled={isPending}
      >
        <Button className="flex items-center gap-2 h-auto py-1 px-3 rounded-lg border-slate-200">
          <Tag color={STATUS_COLORS[status] || "default"} className="uppercase font-black tracking-widest m-0 border-none px-2 py-0.5">
            {status}
          </Tag>
          {isPending ? <LoadingOutlined className="text-slate-400" /> : <DownOutlined className="text-[10px] text-slate-400" />}
        </Button>
      </Dropdown>
    </>
  );
}