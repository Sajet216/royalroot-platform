import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | ETHEREAL",
  description: "Welcome back to RoyalRoot Interiors. Access your bespoke collection.",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-12">
        <h1 className="font-serif text-[64px] leading-[1.1] tracking-[-0.02em] mb-4 text-[#1a1c1a]">
          Sign In
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#444748]">
          Welcome back to RoyalRoot Interiors. Access your bespoke collection.
        </p>
      </div>
      
      <LoginForm />
    </>
  );
}
