import { UserProfile } from '@clerk/clerk-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center p-8">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
