import { Globe, Layers, Users } from 'lucide-react';
import { LoginForm } from '@/components/forms/LoginForm';
import { Logo } from '@/components/layout/Logo';

const highlights = [
  { icon: Globe, text: 'Every website in one workspace' },
  { icon: Layers, text: 'Edit sections and services in seconds' },
  { icon: Users, text: 'Keep team pages always up to date' },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-brand/15 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <Logo variant="wordmark-light" href={null} className="relative h-10 self-start" />

        <div className="relative max-w-md">
          <h1 className="text-4xl font-medium leading-tight tracking-tight">
            Manage all your websites from <span className="text-brand">one place</span>.
          </h1>
          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-brand ring-1 ring-white/10">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-zinc-500">© {new Date().getFullYear()} Nextiaa. All rights reserved.</p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo variant="wordmark" href={null} className="mb-10 h-10 lg:hidden" />
          <h2 className="text-2xl font-medium tracking-tight">Welcome back</h2>
          <p className="mb-8 mt-1 text-sm text-muted-foreground">Sign in to your Nextiaa admin workspace.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
