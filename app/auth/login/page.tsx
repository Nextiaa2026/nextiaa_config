import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#F8F9FA]">
      {/* Extremely Subtle Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="w-full max-w-[400px] z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white p-10 md:p-12 rounded-[1.5rem] border border-[#E9ECEF] shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
              Login
            </h1>
            <p className="text-[#868E96] text-sm font-medium mt-1">
              Enter your details to proceed
            </p>
          </div>
          
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
