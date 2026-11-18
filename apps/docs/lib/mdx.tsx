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
import type { ShikiTransformer } from 'shiki';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { collectExampleCode } from '@/lib/example-code';

/**
 * Keeps the fence language on the element. The rendered DOM doubles as the
 * source for "copy as Markdown", which has no other way to tell a shell session
 * from a TypeScript snippet.
 */
const fenceLanguage: ShikiTransformer = {
  pre(node) {
    node.properties['data-language'] = this.options.lang;
  },
};

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
          ...collectExampleCode(source),
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
                transformers: [fenceLanguage],
              },
            ],
          ],
        },
      }}
    />
  );
}
