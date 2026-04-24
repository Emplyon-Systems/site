import { useRef, useState } from 'react';
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Heading2,
  Image as ImageIcon,
  Link2,
  List,
  Minus,
  Plus,
  Quote,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blockTypeLabel, convertBlock, newBlock } from '@/lib/articleBlocks';

const TYPE_OPTIONS = [
  { value: 'p', icon: AlignLeft },
  { value: 'h2', icon: Heading2 },
  { value: 'ul', icon: List },
  { value: 'quote', icon: Quote },
  { value: 'image', icon: ImageIcon },
  { value: 'hr', icon: Minus },
];

function ImageBlockFields({ block, onPatch, uploadImageFile }) {
  const fileRef = useRef(null);
  const [fileErr, setFileErr] = useState('');
  const maxBytes = uploadImageFile ? 5 * 1024 * 1024 : 2.5 * 1024 * 1024;

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFileErr('Use um ficheiro de imagem (JPEG, PNG, WebP…).');
      return;
    }
    if (file.size > maxBytes) {
      setFileErr(
        uploadImageFile
          ? 'Imagem demasiado grande (máx. 5 MB).'
          : 'Imagem demasiado grande (máx. 2,5 MB).',
      );
      return;
    }
    setFileErr('');
    if (uploadImageFile) {
      try {
        const url = await uploadImageFile(file);
        onPatch((b) => ({ ...b, src: url }));
      } catch (err) {
        setFileErr(err.message || 'Falha ao enviar a imagem.');
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPatch((b) => ({ ...b, src: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  }

  const urlValue = block.src?.startsWith('data:') ? '' : (block.src ?? '');

  return (
    <div className="space-y-3">
      {fileErr ? <p className="text-xs text-red-600">{fileErr}</p> : null}
      <p className="text-xs text-gray-500">
        Carregue um ficheiro (enviado para o servidor) ou cole um URL. Também pode usar imagens já alojadas.
      </p>

      {block.src ? (
        <div className="relative mx-auto max-w-xl rounded-lg border border-gray-200 bg-gray-50 p-2">
          <img
            src={block.src}
            alt={block.alt || ''}
            className="mx-auto max-h-64 w-full object-contain"
          />
          <button
            type="button"
            onClick={() => onPatch((b) => ({ ...b, src: '' }))}
            className="absolute right-3 top-3 rounded-lg bg-white/95 p-1.5 text-gray-600 shadow hover:bg-white"
            aria-label="Remover imagem"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => fileRef.current?.click()}
        >
          <ImageIcon className="mr-1.5 size-4" />
          Carregar imagem
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">URL da imagem</label>
        <div className="relative mt-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={urlValue}
            onChange={(e) => onPatch((b) => ({ ...b, src: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-royal-blue/25"
            placeholder="https://…"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Texto alternativo (acessibilidade)</label>
        <input
          value={block.alt ?? ''}
          onChange={(e) => onPatch((b) => ({ ...b, alt: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/25"
          placeholder="Descreva a imagem para leitores de ecrã"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Legenda (opcional)</label>
        <input
          value={block.caption ?? ''}
          onChange={(e) => onPatch((b) => ({ ...b, caption: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/25"
          placeholder="Aparece abaixo da imagem no artigo"
        />
      </div>
    </div>
  );
}

function BlockCardHeader({ type, onTypeChange, onMoveUp, onMoveDown, onRemove, disableUp, disableDown }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
      <div className="relative min-w-[10rem] flex-1 sm:flex-initial">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-9 text-xs font-semibold uppercase tracking-wide text-deep-navy outline-none focus:ring-2 focus:ring-royal-blue/30"
          aria-label="Tipo de bloco"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {blockTypeLabel(o.value)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disableUp}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          aria-label="Mover bloco para cima"
        >
          <ArrowUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disableDown}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          aria-label="Mover bloco para baixo"
        >
          <ArrowDown className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Remover bloco"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function ArticleBlockEditor({ blocks, onChange, uploadImageFile }) {
  function updateAt(index, next) {
    const copy = [...blocks];
    copy[index] = next;
    onChange(copy);
  }

  function patchBlock(index, fn) {
    const copy = [...blocks];
    copy[index] = fn(copy[index]);
    onChange(copy);
  }

  function move(index, dir) {
    const j = index + dir;
    if (j < 0 || j >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[j]] = [copy[j], copy[index]];
    onChange(copy);
  }

  function removeAt(index) {
    if (blocks.length <= 1) return;
    onChange(blocks.filter((_, i) => i !== index));
  }

  function addBlock(type, afterIndex = null) {
    const b = newBlock(type);
    if (afterIndex == null) {
      onChange([...blocks, b]);
      return;
    }
    const copy = [...blocks];
    copy.splice(afterIndex + 1, 0, b);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div
          key={block.id}
          className="rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/[0.02]"
        >
          <div className="p-4">
            <BlockCardHeader
              type={block.type}
              onTypeChange={(t) => updateAt(i, convertBlock(block, t))}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              onRemove={() => removeAt(i)}
              disableUp={i === 0}
              disableDown={i === blocks.length - 1}
            />

            <div className="pt-4">
              {block.type === 'hr' ? (
                <div className="flex items-center gap-3 py-4 text-sm text-gray-400">
                  <Minus className="size-5 shrink-0" />
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wider">Separador visual</span>
                </div>
              ) : null}

              {block.type === 'p' ? (
                <textarea
                  value={block.text ?? ''}
                  onChange={(e) => patchBlock(i, (b) => ({ ...b, text: e.target.value }))}
                  rows={5}
                  placeholder="Escreva o parágrafo. Use Enter para quebras dentro do mesmo bloco."
                  className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm leading-relaxed text-deep-navy outline-none transition-colors placeholder:text-gray-400 focus:border-royal-blue/40 focus:bg-white focus:ring-2 focus:ring-royal-blue/20"
                />
              ) : null}

              {block.type === 'h2' ? (
                <input
                  value={block.text ?? ''}
                  onChange={(e) => patchBlock(i, (b) => ({ ...b, text: e.target.value }))}
                  placeholder="Título da secção"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-lg font-semibold text-deep-navy outline-none placeholder:text-gray-400 focus:border-royal-blue/40 focus:bg-white focus:ring-2 focus:ring-royal-blue/20"
                />
              ) : null}

              {block.type === 'quote' ? (
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-royal-blue/70" aria-hidden />
                  <textarea
                    value={block.text ?? ''}
                    onChange={(e) => patchBlock(i, (b) => ({ ...b, text: e.target.value }))}
                    rows={4}
                    placeholder="Citação ou destaque"
                    className="w-full resize-y rounded-r-lg border border-l-0 border-gray-200 bg-royal-blue/[0.04] py-2.5 pl-4 pr-3 text-sm italic leading-relaxed text-deep-navy outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-royal-blue/20"
                  />
                </div>
              ) : null}

              {block.type === 'image' ? (
                <ImageBlockFields
                  block={block}
                  onPatch={(fn) => patchBlock(i, fn)}
                  uploadImageFile={uploadImageFile}
                />
              ) : null}

              {block.type === 'ul' ? (
                <ul className="space-y-2">
                  {(block.items ?? ['']).map((li, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-royal-blue" aria-hidden />
                      <input
                        value={li}
                        onChange={(e) => {
                          patchBlock(i, (b) => {
                            const items = [...(b.items ?? [])];
                            items[j] = e.target.value;
                            return { ...b, items };
                          });
                        }}
                        placeholder={`Item ${j + 1}`}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm outline-none focus:border-royal-blue/40 focus:bg-white focus:ring-2 focus:ring-royal-blue/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          patchBlock(i, (b) => {
                            const items = [...(b.items ?? [])].filter((_, k) => k !== j);
                            return { ...b, items: items.length ? items : [''] };
                          });
                        }}
                        className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                        disabled={(block.items ?? []).length <= 1}
                        aria-label="Remover item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                  <li>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1 h-8 rounded-lg border-dashed text-xs"
                      onClick={() => {
                        patchBlock(i, (b) => ({
                          ...b,
                          items: [...(b.items ?? []), ''],
                        }));
                      }}
                    >
                      <Plus className="mr-1 size-3.5" />
                      Adicionar item
                    </Button>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
            <span className="mr-auto self-center text-xs font-medium text-gray-500">Inserir abaixo:</span>
            {TYPE_OPTIONS.map((o) => (
              <button
                key={`${block.id}-add-${o.value}`}
                type="button"
                onClick={() => addBlock(o.value, i)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-deep-navy shadow-sm transition-colors hover:border-royal-blue/40 hover:text-royal-blue"
              >
                <Plus className="size-3.5" />
                {blockTypeLabel(o.value)}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
        <p className="mb-3 text-sm font-medium text-gray-600">Adicionar ao final do artigo</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TYPE_OPTIONS.map((o) => {
            const Icon =
              o.value === 'p'
                ? AlignLeft
                : o.value === 'h2'
                  ? Heading2
                  : o.value === 'ul'
                    ? List
                    : o.value === 'quote'
                      ? Quote
                      : o.value === 'image'
                        ? ImageIcon
                        : Minus;
            return (
              <Button
                key={o.value}
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => addBlock(o.value)}
              >
                <Icon className="mr-1.5 size-4" />
                {blockTypeLabel(o.value)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}