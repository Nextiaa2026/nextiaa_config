import { LoginForm } from '@/components/forms/LoginForm';
import { Logo } from '@/components/layout/Logo';

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col justify-center py-12 max-w-sm mx-auto w-full">
      <div className="mb-8">
        <Logo href={null} className="h-14 w-14" />
        <p className="text-muted-foreground text-sm font-medium mt-6">
          Enter your details to proceed
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
