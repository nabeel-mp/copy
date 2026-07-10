import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import CategorySelect from '../../components/CategorySelect';
import ImageUrlListInput from '../../components/ImageUrlListInput';
import * as adminService from '../../api/adminService';

const emptyForm = {
  name: '',
  category: '',
  brand: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  images: [''],
  isActive: true,
};

function FormSection({ title, children }) {
  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#004aad] disabled:opacity-60";

// Fields the current backend Product schema doesn't support yet. Rendered
// so the admin form's information architecture matches the target catalog
// structure (SKU, specs, commission, warranty, SEO), but disabled and
// clearly labeled so nothing here is silently dropped on submit - it just
// isn't sent, because there's nowhere on the server for it to go yet.
//
// TODO(backend): to make these real, Product schema needs:
//   sku: String
//   specifications: [{ key: String, value: String }]
//   commissionRate: Number (and a real payout mechanism - see Wallet's
//     transaction.reason enum, which has no 'commission' value today)
//   warrantyMonths: Number
//   metaTitle / metaDescription: String
function PendingBackendField({ label, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
        <Lock size={11} /> {label}
      </label>
      <input
        disabled
        placeholder={placeholder}
        className="w-full border-2 border-gray-100 bg-gray-100 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
      />
    </div>
  );
}

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    // Prefer the product handed over via navigate() state (no extra
    // network call). Fall back to fetching the admin product list and
    // finding it by id - covers direct navigation/refresh on this URL.
    const stateProduct = location.state?.product;
    if (stateProduct && stateProduct._id === id) {
      hydrateForm(stateProduct);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    adminService.getAllProducts({ limit: 1000 })
      .then((res) => {
        if (cancelled) return;
        const found = (res.products || []).find((p) => p._id === id);
        if (found) hydrateForm(found);
        else setErrorMessage('Product not found.');
      })
      .catch((err) => {
        if (!cancelled) setErrorMessage(err.response?.data?.message || 'Could not load product.');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const hydrateForm = (product) => {
    setForm({
      name: product.name || '',
      category: product.category?._id || product.category || '',
      brand: product.brand || '',
      description: product.description || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      stock: product.stock ?? '',
      images: product.images?.length ? product.images : [''],
      isActive: product.isActive ?? true,
    });
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const isValid =
    form.name.trim().length > 0 &&
    form.category.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.price !== '' && Number(form.price) >= 0 &&
    form.stock !== '' && Number(form.stock) >= 0 &&
    (form.discountPrice === '' || Number(form.discountPrice) >= 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.map((u) => u.trim()).filter(Boolean),
      ...(form.discountPrice !== '' ? { discountPrice: Number(form.discountPrice) } : {}),
      ...(isEditMode ? { isActive: form.isActive } : {}),
    };

    try {
      if (isEditMode) {
        await adminService.updateProduct(id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not save product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-5 flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/admin/products')} aria-label="Go back" className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#004aad]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-5 mt-5 space-y-4">
          {errorMessage && (
            <p className="text-sm text-center text-red-600 font-bold p-3 bg-red-50 rounded-lg">{errorMessage}</p>
          )}

          <FormSection title="Basic Information">
            <Field label="Product Name" required>
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className={inputClass}
                placeholder="e.g. Havells 1.5 sq mm Wire"
              />
            </Field>
            <Field label="Category" required>
              <CategorySelect value={form.category} onChange={(v) => setField('category', v)} />
            </Field>
            <Field label="Brand">
              <input
                value={form.brand}
                onChange={(e) => setField('brand', e.target.value)}
                className={inputClass}
                placeholder="e.g. Havells"
              />
            </Field>
            <Field label="Description" required>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={4}
                className={inputClass}
                placeholder="Product details buyers will see"
              />
            </Field>
          </FormSection>

          <FormSection title="Pricing & Commission">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)" required>
                <input
                  type="number" min="0" step="0.01"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Discount Price (₹)">
                <input
                  type="number" min="0" step="0.01"
                  value={form.discountPrice}
                  onChange={(e) => setField('discountPrice', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <PendingBackendField label="Commission Rate (%)" placeholder="Requires backend commission model" />
          </FormSection>

          <FormSection title="Inventory">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock Quantity" required>
                <input
                  type="number" min="0"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                  className={inputClass}
                />
              </Field>
              {isEditMode && (
                <Field label="Status">
                  <select
                    value={form.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setField('isActive', e.target.value === 'active')}
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Field>
              )}
            </div>
            <PendingBackendField label="SKU" placeholder="Requires backend schema field" />
          </FormSection>

          <FormSection title="Product Specifications">
            <p className="text-xs text-gray-400 -mt-1 mb-1">
              Custom spec fields (dimensions, material, voltage, etc.) require a backend schema update and aren't saved yet.
            </p>
            <PendingBackendField label="Specification (e.g. Voltage Rating)" placeholder="Coming soon" />
          </FormSection>

          <FormSection title="Images">
            <ImageUrlListInput value={form.images} onChange={(v) => setField('images', v)} />
          </FormSection>

          <FormSection title="SEO / Metadata">
            <p className="text-xs text-gray-400 -mt-1 mb-1">Optional, for future search-engine optimization.</p>
            <PendingBackendField label="Meta Title" placeholder="Coming soon" />
          </FormSection>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-14 bg-[#004aad] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (isEditMode ? 'Save Changes' : 'Create Product')}
          </button>
        </form>
      )}
    </div>
  );
}