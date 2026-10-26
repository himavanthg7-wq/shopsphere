import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import { ArrowUpDown, SearchX } from 'lucide-react';

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortDir = searchParams.get('sortDir') || 'desc';

  useEffect(() => {
    categoryApi.getCategories().then((res) => setCategories(res || []));
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          keyword: keyword || undefined,
          categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          minRating: minRating ? parseFloat(minRating) : undefined,
          page,
          size: 12,
          sortBy,
          sortDir,
        };
        const data = await productApi.getProducts(params);
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [keyword, categoryId, minPrice, maxPrice, minRating, page, sortBy, sortDir]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val !== null && val !== undefined && val !== '') {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '0'); // reset to page 0 on filter change
    setSearchParams(next);
  };

  const handlePriceChange = (type, val) => {
    if (type === 'min') updateParam('minPrice', val);
    if (type === 'max') updateParam('maxPrice', val);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleSortChange = (e) => {
    const [sb, sd] = e.target.value.split(':');
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', sb);
    next.set('sortDir', sd);
    setSearchParams(next);
  };

  const currentSortKey = `${sortBy}:${sortDir}`;

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      {/* Header and Results Meta */}
      <div className="flex items-center justify-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
            {keyword ? `Search results for "${keyword}"` : 'All Products Catalog'}
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Showing {totalElements} items matching your criteria
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} color="#64748b" />
          <select
            value={currentSortKey}
            onChange={handleSortChange}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
          >
            <option value="id:desc">Newest First</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="ratingAvg:desc">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Filter Sidebar + Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28 }}>
        {/* Sidebar Filters */}
        <div>
          <ProductFilter
            categories={categories}
            selectedCategory={categoryId}
            onSelectCategory={(id) => updateParam('categoryId', id)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChangePrice={handlePriceChange}
            minRating={minRating}
            onSelectRating={(r) => updateParam('minRating', r)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Products Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
              Finding the best matches...
            </div>
          ) : products.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <SearchX size={48} color="#94a3b8" />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>No matching products found</h3>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                  Try removing some filters or search for another keyword.
                </p>
              </div>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2" style={{ marginTop: 40 }}>
                  <button
                    onClick={() => updateParam('page', Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: 13, color: '#64748b', padding: '0 8px' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => updateParam('page', Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
