"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/misUI/breadcrumb";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export default function DynamicBreadcrumb() {
  const breadcrumbItems = useBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isCurrent && (
              <BreadcrumbSeparator
                className={index === 0 ? "hidden md:block" : ""}
              />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
