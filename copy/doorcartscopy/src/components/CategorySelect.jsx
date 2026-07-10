import { useState, useEffect } from 'react';
import * as categoryService from '../api/categoryService';

export default function CategorySelect({ value, onChange, required = false, id = 'category-select' }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    categoryService.getCategories()
      .then((data) => { if (!cancelled) setCategories(data || []); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || 'Could not load categories.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={isLoading}
      className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#004aad] disabled:opacity-60"
    >
      <option value="" disabled>
        {isLoading ? 'Loading categories...' : 'Select a category'}
      </option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>
  );
}