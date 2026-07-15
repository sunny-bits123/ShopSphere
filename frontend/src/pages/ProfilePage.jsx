import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../utils/api';
import toast from 'react-hot-toast';

const EMPTY_ADDRESS = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  country: 'India',
  isDefault: false,
};

const ProfilePage = () => {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await fetchUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(pwForm);
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressForm);
        toast.success('Address updated!');
      } else {
        await addAddress(addressForm);
        toast.success('Address added!');
      }
      await fetchUser();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm(EMPTY_ADDRESS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      await fetchUser();
      toast.success('Address deleted!');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await fetchUser();
      toast.success('Default address updated!');
    } catch (err) {
      toast.error('Failed to set default');
    }
  };

  return (
    <div className="container profile-page">
      <h1>My Profile</h1>
      <div className="profile-grid">

        {/* Personal Info */}
        <div className="detail-card">
          <h3>Personal Info</h3>
          <form onSubmit={handleProfile} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={user?.email} disabled />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="detail-card">
          <h3>Change Password</h3>
          <form onSubmit={handlePassword} className="auth-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary">Update Password</button>
          </form>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="detail-card" style={{ marginTop: '1.5rem' }}>
        <div className="address-header">
          <h3>Saved Addresses</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm(EMPTY_ADDRESS); }}
          >
            + Add New Address
          </button>
        </div>

        {/* Address Form */}
        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="address-form">
            <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Label</label>
                <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}>
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="10-digit mobile number" required />
              </div>
              <div className="form-group form-fullw">
                <label>Street / House No.</label>
                <input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="House no, Street, Area" required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" required />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} placeholder="6-digit pincode" required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} />
              </div>
            </div>
            <label className="checkbox-label" style={{ marginBottom: '1rem' }}>
              <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
              Set as default address
            </label>
            <div className="btn-row">
              <button type="button" className="btn btn-outline" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingAddress ? 'Update Address' : 'Save Address'}</button>
            </div>
          </form>
        )}

        {/* Address List */}
        {user?.addresses?.length === 0 ? (
          <p className="no-addresses">No saved addresses yet. Add one above!</p>
        ) : (
          <div className="addresses-grid">
            {user?.addresses?.map((addr) => (
              <div key={addr._id} className={`address-card ${addr.isDefault ? 'address-card--default' : ''}`}>
                <div className="address-card-header">
                  <span className="address-label">{addr.label}</span>
                  {addr.isDefault && <span className="address-default-badge">✓ Default</span>}
                </div>
                <p className="address-text">{addr.street}</p>
                <p className="address-text">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="address-text">📞 {addr.phone}</p>
                <div className="address-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => handleEditAddress(addr)}>Edit</button>
                  {!addr.isDefault && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleSetDefault(addr._id)}>Set Default</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;