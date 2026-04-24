import { cn } from '@/lib/utils';

export function BlogContent({ blocks, className }) {
  if (!blocks?.length) return null;

  return (
    <div className={cn('space-y-0', className)}>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;

        if (block.type === 'p') {
          return (
            <p key={key} className="text-base md:text-lg text-gray-600 leading-[1.85] mb-7 tracking-[0.01em]">
              {block.text}
            </p>
          );
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={key}
              className="text-xl md:text-2xl font-heading font-bold text-deep-navy mt-12 mb-5 pb-3 border-b border-gray-100"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === 'ul' && block.items) {
          return (
            <ul key={key} className="my-7 space-y-3.5">
              {block.items.map((li, j) => (
                <li key={j} className="flex items-start gap-3.5 text-base md:text-lg text-gray-600 leading-relaxed">
                  <span className="mt-[0.55rem] shrink-0 w-2 h-2 rounded-full bg-royal-blue" />
                  {li}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={key}
              className="my-10 border-l-4 border-royal-blue bg-royal-blue/[0.06] py-4 pl-6 pr-4 text-base md:text-lg italic text-deep-navy/90 leading-relaxed"
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === 'hr') {
          return <hr key={key} className="my-12 border-0 border-t border-gray-200" />;
        }

        if (block.type === 'image' && block.src) {
          return (
            <figure key={key} className="my-10">
              <img
                src={block.src}
                alt={block.alt || ''}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 object-cover shadow-sm"
                loading="lazy"
              />
              {block.caption ? (
                <figcaption className="mt-3 text-center text-sm text-gray-500">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
