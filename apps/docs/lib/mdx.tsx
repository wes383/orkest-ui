import rehypeShiki from '@shikijs/rehype';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Plus,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/mdx/mdx-components';

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        blockJS: false,
        scope: {
          ArrowRight,
          ArrowUpRight,
          Check,
          Circle,
          Plus,
          Search,
          Settings,
          Trash2,
        },
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeShiki,
              {
                themes: {
                  light: 'github-light',
                  dark: 'github-dark',
                },
                defaultColor: 'light',
              },
            ],
          ],
        },
      }}
    />
  );
}
