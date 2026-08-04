import RegisterHeader from "@/components/register/RegisterHeader";

export default async function RegisterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <RegisterHeader subdomain={subdomain} />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
