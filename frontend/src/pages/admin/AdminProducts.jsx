// pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    getProducts({ limit: 50 }).then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>
      {loading ? <div className="spinner" /> : (
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.images?.[0]?.url} alt="" className="admin-product-thumb" /></td>
                <td>{p.name}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td><span className={p.stock > 0 ? 'in-stock' : 'out-stock'}>{p.stock}</span></td>
                <td>{p.category?.name || '—'}</td>
                <td>
                  <Link to={`/admin/products/${p._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
