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

        return null;
      })}
    </div>
  );
}
