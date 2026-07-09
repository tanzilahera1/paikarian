import Header from "@/components/layout/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-12">{children}</main>
    </>
  );
}
