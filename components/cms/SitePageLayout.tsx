import type {ReactNode} from 'react';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import type {CmsPageBlock} from '@/lib/cms';

/** The chrome every designed inner page shares; sections go in between. */
export default function SitePageLayout({title, children}: {title: string; children: ReactNode}) {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={title} currentLabel={title} />
          {children}
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}

/** Renders CMS blocks in admin order. `render` returns null for block types a page does not know. */
export function renderBlocks(blocks: CmsPageBlock[], render: (block: CmsPageBlock) => ReactNode): ReactNode {
  return blocks.map((block, index) => <div key={`${block.type}-${index}`}>{render(block)}</div>);
}
