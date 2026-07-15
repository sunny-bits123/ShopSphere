import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  updateProduct,
  getProduct,
  getCategories,
} from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  brand: '',
  stock: '',
  category: '',
  isFeatured: false,
  tags: '',
  images: [{ url: '' }],
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories));
    if (isEdit) {
      getProduct(id)
        .then(({ data }) => {
          const p = data.product;
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            discountPrice: p.discountPrice || '',
            brand: p.brand || '',
            stock: p.stock || '',
            category: p.category?._id || '',
            isFeatured: p.isFeatured || false,
            tags: (p.tags || []).join(', '),
            images: p.images?.length ? p.images : [{ url: '' }],
          });
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setImageUrl = (i, url) => {
    const imgs = [...form.images];
    imgs[i] = { ...imgs[i], url };
    set('images', imgs);
  };

  const addImageField = () => set('images', [...form.images, { url: '' }]);

  const removeImageField = (i) => {
    const imgs = form.images.filter((_, idx) => idx !== i);
    set('images', imgs.length ? imgs : [{ url: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.filter((img) => img.url.trim()),
      };

      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container spinner-page"><div className="spinner" /></div>;

  return (
    <div className="container admin-page">
      <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid-2">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              placeholder="e.g. Sony"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            placeholder="Describe the product..."
            required
          />
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Discount Price (₹)</label>
            <input
              type="number"
              min="0"
              value={form.discountPrice}
              onChange={(e) => set('discountPrice', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="e.g. wireless, audio, bluetooth"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)}
            />
            Featured Product (shown on homepage)
          </label>
        </div>

        {/* Image URLs */}
        <div className="form-group">
          <label>Product Images (URLs)</label>
          {form.images.map((img, i) => (
            <div key={i} className="image-url-row">
              <input
                type="url"
                value={img.url}
                onChange={(e) => setImageUrl(i, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {img.url && (
                <img src={img.url} alt="preview" className="img-preview" />
              )}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeImageField(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={addImageField}
          >
            + Add Image URL
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
