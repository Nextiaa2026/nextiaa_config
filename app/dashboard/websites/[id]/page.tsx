'use client';

import { useParams } from 'next/navigation';
import { useWebsite } from '@/hooks/useWebsites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Layers, ArrowUpRight, BarChart3, ShieldCheck, Activity, Settings, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { cn } from '@/lib/utils';

export default function WebsiteOverviewPage() {
  const params = useParams();
  const websiteId = params.id as string;
  const { data: website } = useWebsite(websiteId);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const stats = [
    { name: 'sections', value: website?.sections?.length || 0, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'services', value: website?.services?.length || 0, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'team', value: website?.teamMembers?.length || 0, icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border border-[#F1F3F5] bg-white rounded overflow-hidden group shadow-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-[#ADB5BD]">{stat.name}</p>
                <h3 className="text-2xl font-medium text-[#212529]">{stat.value}</h3>
              </div>
              <div className={cn('h-9 w-9 rounded flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-[#F1F3F5] bg-white rounded overflow-hidden shadow-none">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2 text-[#212529]">
                <Activity className="h-4 w-4 text-emerald-500" />
                live status
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-[#F8F9FA]" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit3 className="h-4 w-4 text-[#868E96]" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded px-3 font-medium text-xs gap-2 hover:bg-[#F8F9FA]" asChild>
                  <a href={website?.url} target="_blank" rel="noopener noreferrer">
                    visit platform <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded border border-[#F1F3F5]">
               <div className="h-8 w-8 rounded bg-emerald-500 flex items-center justify-center">
                 <ShieldCheck className="h-4 w-4 text-white" />
               </div>
               <div>
                 <p className="font-medium text-sm text-[#212529]">platform operational</p>
                 <p className="text-[#868E96] font-medium text-[10px]">real-time verified</p>
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-medium text-[#ADB5BD]">
                <span>domain verification</span>
                <span className="text-emerald-500">active</span>
              </div>
              <div className="h-1.5 w-full bg-[#F1F3F5] rounded overflow-hidden">
                <div className="h-full bg-emerald-500 w-[95%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F1F3F5] bg-white rounded overflow-hidden shadow-none">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-[#212529]">
              <BarChart3 className="h-4 w-4 text-[#212529]" />
              quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-2 gap-3">
             <Link href={`/dashboard/websites/${websiteId}/sections`} className="flex flex-col items-center justify-center p-5 bg-white rounded border hover:bg-primary hover:text-primary-foreground transition-all group">
                <Layers className="h-4 w-4 mb-2" />
                <span className="font-medium text-[10px]">add section</span>
             </Link>
             <Link href={`/dashboard/websites/${websiteId}/team`} className="flex flex-col items-center justify-center p-5 bg-white rounded border hover:bg-primary hover:text-primary-foreground transition-all group">
                <Users className="h-4 w-4 mb-2" />
                <span className="font-medium text-[10px]">invite member</span>
             </Link>
             <Link href={`/dashboard/websites/${websiteId}/services`} className="flex flex-col items-center justify-center p-5 bg-white rounded border hover:bg-primary hover:text-primary-foreground transition-all group">
                <Briefcase className="h-4 w-4 mb-2" />
                <span className="font-medium text-[10px]">create service</span>
             </Link>
             <button 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex flex-col items-center justify-center p-5 bg-white rounded border hover:bg-primary hover:text-primary-foreground transition-all group"
             >
                <Settings className="h-4 w-4 mb-2" />
                <span className="font-medium text-[10px]">config</span>
             </button>
          </CardContent>
        </Card>
      </div>

      {website && (
        <WebsiteDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => setIsEditDialogOpen(false)} 
          initialData={website}
        />
      )}
    </div>
  );
}
