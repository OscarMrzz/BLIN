import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/misUI/sidebar";

import DynamicBreadcrumb from "@/components/Breadcrumb/DynamicBreadcrumb";

import { Separator } from "@/components/misUI/separator";
import { TooltipProvider } from "@/components/misUI/tooltip";
type Props = {
  children: React.ReactNode;
};

export default function SidebarGeneral({ children }: Props) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
