import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkSignIn signUpUrl="/sign-up" afterSignInUrl="/" />
    </div>
  );
}
