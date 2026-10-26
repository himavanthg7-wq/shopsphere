import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function ProductFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onChangePrice,
  minRating,
  onSelectRating,
  onResetFilters,
}) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
        <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 16 }}>
          <Filter size={18} color="#2563eb" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="btn btn-secondary btn-sm"
          style={{ padding: '4px 8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Categories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onSelectCategory(null)}
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === String(cat.id)}
                onChange={() => onSelectCategory(String(cat.id))}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Price (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onChangePrice('min', e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: 13 }}
          />
          <span style={{ color: '#94a3b8' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onChangePrice('max', e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Ratings Filter */}
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Minimum Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: '4★ & Above', value: '4' },
            { label: '3★ & Above', value: '3' },
            { label: 'All Ratings', value: '' },
          ].map((r) => (
            <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
              <input
                type="radio"
                name="rating"
                checked={minRating === r.value}
                onChange={() => onSelectRating(r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
