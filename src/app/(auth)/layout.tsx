import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md">
        <Link className="mb-8 block text-center text-lg font-semibold" href="/">
          CareerFlow
        </Link>
        {children}
      </div>
    </main>
  );
}
