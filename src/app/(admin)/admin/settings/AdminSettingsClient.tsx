"use client";

import React, { useState } from "react";
import { Form, Input, InputNumber, Switch, Button, Typography, Divider, Card, message } from "antd";
import { ShopOutlined, RocketOutlined, LinkOutlined, ToolOutlined, SaveOutlined } from "@ant-design/icons";
import { updateSettings } from "@/actions/adminSettings";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function AdminSettingsClient({ initialSettings }: { initialSettings: any }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await updateSettings(values);
      if (res.success) {
        message.success("Settings updated successfully!");
        router.refresh();
      } else {
        message.error(res.error || "Failed to update settings");
      }
    } catch (error: any) {
      message.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Store Settings
        </Title>
        <Text type="secondary" className="font-medium">Configure global e-commerce variables and logistics.</Text>
      </div>

      <Card variant="borderless" className="shadow-sm rounded-2xl">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            storeName: initialSettings?.storeName || "Paikarian",
            storeEmail: initialSettings?.storeEmail || "",
            storePhone: initialSettings?.storePhone || "",
            currency: initialSettings?.currency || "BDT",
            deliveryChargeInside: initialSettings?.deliveryChargeInside || 60,
            deliveryChargeOutside: initialSettings?.deliveryChargeOutside || 120,
            freeShippingThreshold: initialSettings?.freeShippingThreshold || 0,
            facebookURL: initialSettings?.facebookURL || "",
            instagramURL: initialSettings?.instagramURL || "",
            maintenanceMode: initialSettings?.maintenanceMode || false,
          }}
          onFinish={onFinish}
          requiredMark={false}
          className="settings-form"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShopOutlined className="text-blue-500 text-lg" />
              <Text strong className="text-lg">General Information</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item label={<Text strong>Store Name</Text>} name="storeName" rules={[{ required: true, message: 'Please enter store name' }]}>
                <Input size="large" className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Currency Symbol</Text>} name="currency" rules={[{ required: true }]}>
                <Input size="large" className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Contact Email</Text>} name="storeEmail" rules={[{ type: 'email' }]}>
                <Input size="large" placeholder="support@store.com" className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Contact Phone</Text>} name="storePhone">
                <Input size="large" placeholder="+880 1..." className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-8 border-slate-100" />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <RocketOutlined className="text-emerald-500 text-lg" />
              <Text strong className="text-lg">Logistics & Shipping</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item label={<Text strong>Delivery Charge (Inside Dhaka)</Text>} name="deliveryChargeInside">
                <InputNumber size="large" prefix="৳" className="w-full rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Delivery Charge (Outside Dhaka)</Text>} name="deliveryChargeOutside">
                <InputNumber size="large" prefix="৳" className="w-full rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Free Shipping Threshold (৳)</Text>} name="freeShippingThreshold" tooltip="Set 0 to disable free shipping">
                <InputNumber size="large" prefix="৳" className="w-full rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-8 border-slate-100" />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkOutlined className="text-indigo-500 text-lg" />
              <Text strong className="text-lg">Social Links</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item label={<Text strong>Facebook URL</Text>} name="facebookURL">
                <Input size="large" placeholder="https://facebook.com/yourpage" className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
              <Form.Item label={<Text strong>Instagram URL</Text>} name="instagramURL">
                <Input size="large" placeholder="https://instagram.com/yourpage" className="rounded-xl bg-slate-50 border-slate-200" />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-8 border-slate-100" />

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ToolOutlined className="text-amber-500 text-lg" />
              <Text strong className="text-lg">System Preferences</Text>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <Text strong className="block text-amber-900">Maintenance Mode</Text>
                <Text className="text-xs text-amber-700">Disable customer access while you make changes.</Text>
              </div>
              <Form.Item name="maintenanceMode" valuePropName="checked" className="m-0">
                <Switch />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={loading}
              size="large"
              className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl px-8"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
