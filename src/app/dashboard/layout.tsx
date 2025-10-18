import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { requireSession } from '@/lib/auth-check';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
  title: 'TubeBoost',
  description: 'YouTube Boost for Playlists & Videos'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Protecting the dashboard from unauthenticated access
  await requireSession();

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <KBar>
      <MantineProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
      </MantineProvider>
    </KBar>
  );
}
