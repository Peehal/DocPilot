import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkSignUp signInUrl="/sign-in" afterSignUpUrl="/" />
    </div>
  );
}
