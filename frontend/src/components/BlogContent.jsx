import { cn } from '@/lib/utils';

export function BlogContent({ blocks, className }) {
  if (!blocks?.length) return null;
  return (
    <div className={cn('prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-deep-navy prose-p:text-gray-700 prose-li:text-gray-700', className)}>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        if (block.type === 'p') {
          return (
            <p key={key} className="leading-relaxed mb-4 text-base md:text-lg text-gray-700">
              {block.text}
            </p>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2 key={key} className="text-2xl font-heading font-bold text-deep-navy mt-10 mb-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul' && block.items) {
          return (
            <ul key={key} className="list-disc pl-6 space-y-2 mb-6 text-base md:text-lg text-gray-700">
              {block.items.map((li, j) => (
                <li key={j} className="leading-relaxed">
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
