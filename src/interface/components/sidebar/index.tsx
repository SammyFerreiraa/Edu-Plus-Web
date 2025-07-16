"use client";

import type React from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/interface/styles/utils";
import { Button } from "../ui/button";
import { useSidebar } from "./context";

// Sidebar Root Component
type SidebarProps = {
   children: React.ReactNode;
   className?: string;
};

const SidebarRoot: React.FC<SidebarProps> = ({ children, className }) => {
   const { isOpen, isMobile, closeSidebar } = useSidebar();

   return (
      <>
         {/* Mobile Overlay */}
         <div
            className={cn(
               "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
               isMobile && isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={closeSidebar}
         />

         {/* Sidebar */}
         <div
            className={cn(
               "relative z-50 flex h-screen flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
               // Desktop
               !isMobile && (isOpen ? "w-64" : "w-16"),
               // Mobile
               isMobile && "fixed inset-y-0 left-0 w-64",
               isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
               !isMobile && "sticky top-0 h-screen",
               className
            )}
         >
            {children}
         </div>
      </>
   );
};

// Sidebar Header Component
interface SidebarHeaderProps {
   children: React.ReactNode;
   className?: string;
   showCloseButton?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className, showCloseButton = true }) => {
   const { isOpen, isMobile, closeSidebar } = useSidebar();

   return (
      <div
         className={cn(
            "flex items-center justify-between border-b border-gray-200 p-4",
            !isMobile && !isOpen && "justify-center p-2",
            className
         )}
      >
         <div className={cn("flex items-center", !isOpen && !isMobile && "hidden")}>{children}</div>

         {!isOpen && !isMobile && <div className="flex items-center justify-center">{children}</div>}

         {isMobile && showCloseButton && (
            <Button onClick={closeSidebar} variant="ghost" size="icon">
               <X className="h-6 w-6" />
            </Button>
         )}
      </div>
   );
};

// Sidebar Content Component
type SidebarContentProps = {
   children: React.ReactNode;
   className?: string;
};

const SidebarContent: React.FC<SidebarContentProps> = ({ children, className }) => {
   return <nav className={cn("flex flex-1 flex-col space-y-1 overflow-y-auto p-4", className)}>{children}</nav>;
};

// Sidebar Item Component
type SidebarItemProps = {
   href: string;
   icon: React.ComponentType<{ className?: string }>;
   children: React.ReactNode;
   className?: string;
   onClick?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, children, className, onClick }) => {
   const pathname = usePathname();
   const { isOpen, isMobile, closeSidebar } = useSidebar();
   const isActive = pathname === href;

   const handleClick = () => {
      if (isMobile) closeSidebar();
      onClick?.();
   };

   return (
      <Link
         href={href}
         className={cn(
            "flex items-center overflow-hidden rounded-lg text-sm font-medium transition-all duration-200",
            isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            isOpen || isMobile ? "w-full justify-start px-3 py-2" : "h-10 w-10 justify-center p-2",
            className
         )}
         title={!isOpen && !isMobile ? children?.toString() : undefined}
         onClick={handleClick}
      >
         <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-700" : "text-gray-500")} />
         {(isOpen || isMobile) && <span className="ml-3 whitespace-nowrap">{children}</span>}
      </Link>
   );
};

// Sidebar Footer Component
interface SidebarFooterProps {
   children: React.ReactNode;
   className?: string;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, className }) => {
   const { isOpen, isMobile } = useSidebar();

   return (
      <div className={cn("border-t border-gray-200 p-4", !isOpen && !isMobile && "flex justify-center p-2", className)}>
         {children}
      </div>
   );
};

// Sidebar Toggle Button Component
interface SidebarToggleProps {
   className?: string;
   icon?: React.ComponentType<{ className?: string }>;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ className, icon: Icon }) => {
   const { toggleSidebar } = useSidebar();

   return (
      <Button onClick={toggleSidebar} variant="ghost" size="icon" className={className}>
         {Icon ? (
            <Icon className="h-6 w-6" />
         ) : (
            <div className="flex h-6 w-6 flex-col justify-center space-y-1">
               <div className="h-0.5 w-4 bg-current"></div>
               <div className="h-0.5 w-4 bg-current"></div>
               <div className="h-0.5 w-4 bg-current"></div>
            </div>
         )}
      </Button>
   );
};

// Sidebar Separator Component
type SidebarSeparatorProps = {
   className?: string;
};

const SidebarSeparator: React.FC<SidebarSeparatorProps> = ({ className }) => {
   return <div className={cn("my-2 w-full border-t border-gray-200", className)} />;
};

export const Sidebar = Object.assign(SidebarRoot, {
   Header: SidebarHeader,
   Content: SidebarContent,
   Item: SidebarItem,
   Footer: SidebarFooter,
   Toggle: SidebarToggle,
   Separator: SidebarSeparator
});
