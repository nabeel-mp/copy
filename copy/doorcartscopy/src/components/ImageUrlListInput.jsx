import { Plus, Trash2, ImageOff } from 'lucide-react';

// Contract: value is string[] (image URLs), onChange(nextArray).
//
// TODO(backend upload): once a real upload endpoint exists, swap the
// per-row <input type="url"> below for a file-picker/dropzone that POSTs
// to the upload endpoint and pushes the returned URL into this same
// string[] array. The value/onChange contract stays identical, so no
// parent component (AdminProductForm) needs to change.
export default function ImageUrlListInput({ value = [], onChange }) {
  const urls = value.length > 0 ? value : [''];

  const updateAt = (index, url) => {
    const next = [...urls];
    next[index] = url;
    onChange(next.filter((u, i) => u.trim() !== '' || i === urls.length - 1));
  };

  const removeAt = (index) => {
    const next = urls.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : ['']);
  };

  const addRow = () => onChange([...urls, '']);

  return (
    <div className="space-y-3">
      {urls.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {url ? (
              <img src={url} alt="" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <ImageOff size={16} className="text-gray-300" />
            )}
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border-2 border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#004aad]"
          />
          {urls.length > 1 && (
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
              className="text-gray-400 hover:text-red-500 p-2 flex-shrink-0"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#004aad]"
      >
        <Plus size={16} /> Add another image
      </button>
    </div>
  );
}