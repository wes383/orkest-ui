import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { getNavigation } from '@/lib/docs-source';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation();

  return (
    <div className="docs-shell">
      <DocsSidebar navigation={navigation} />
      <div className="docs-main">{children}</div>
    </div>
  );
}
