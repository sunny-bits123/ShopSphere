import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratings', label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const ratings = searchParams.get('ratings') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 12 };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (ratings) params.ratings = ratings;

      const { data } = await getProducts(params);
      setProducts(data.products);
      setMeta({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page, minPrice, maxPrice, ratings]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories));
  }, []);

  const updateParam = (key, value) => {
  const params = Object.fromEntries(searchParams);

  if (value) {
    params[key] = value;
  } else {
    delete params[key];
  }

  // Reset page only when filters change
  if (key !== 'page') {
    params.page = 1;
  }

  setSearchParams(params);
};

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <h4>Category</h4>
              <button
                className={`filter-btn ${!category ? 'active' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`filter-btn ${category === cat._id ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Min Rating</h4>
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  className={`filter-btn ${ratings === String(r) ? 'active' : ''}`}
                  onClick={() => updateParam('ratings', String(r))}
                >
                  {'★'.repeat(r)} & up
                </button>
              ))}
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSearchParams({})}
            >
              Clear Filters
            </button>
          </aside>

          {/* Products Area */}
          <div className="products-main">
            <div className="products-toolbar">
              <p className="results-count">
                {keyword && <span>Results for "<strong>{keyword}</strong>" — </span>}
                {meta.total} product{meta.total !== 1 ? 's' : ''}
              </p>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="products-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="pagination">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${meta.currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => updateParam('page', i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
