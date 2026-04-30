import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create an Account | ETHEREAL",
  description: "Begin your journey with RoyalRoot Interiors. Create your account.",
};

export default function SignupPage() {
  return (
    <>
      <div className="mb-12">
        <h1 className="font-serif text-[64px] leading-[1.1] tracking-[-0.02em] mb-4 text-[#1a1c1a]">
          Register
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#444748]">
          Begin your journey with RoyalRoot Interiors. Curate your space.
        </p>
      </div>
      
      <SignupForm />
    </>
  );
}
