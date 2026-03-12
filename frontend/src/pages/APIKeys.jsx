import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Key, Plus, Trash2, AlertCircle, Copy, Check } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function APIKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchKeys = async () => {
    try {
      const response = await client.get('/api/v1/keys/');
      setKeys(response.data);
    } catch (error) {
      console.error('Error fetching keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    if (!keyName.trim()) return;

    try {
      const response = await client.post('/api/v1/keys/', { name: keyName });
      setCreatedKey(response.data);
      setShowCreateModal(false);
      setKeyName('');
      await fetchKeys();
    } catch (error) {
      console.error('Error creating key:', error);
    }
  };

  const handleDeleteKey = async (keyId) => {
    try {
      await client.delete(`/api/v1/keys/${keyId}`);
      setDeleteConfirm(null);
      await fetchKeys();
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(createdKey.full_key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6" data-testid="api-keys-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            API Keys
          </h1>
          <p className="text-gray-600 mt-1">Manage your API keys for authentication</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          data-testid="create-key-btn"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-900 text-sm">Important</div>
          <p className="text-sm text-amber-800 mt-1">
            Your API key is shown only once when created. Store it securely.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : keys.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Key</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Calls</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{key.key_prefix}...</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(key.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{key.total_calls.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        key.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {key.is_active && (
                      <button
                        onClick={() => setDeleteConfirm(key.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        data-testid={`delete-key-btn-${key.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No API keys yet. Create your first key to get started.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" data-testid="create-key-modal">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Create New API Key
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Production Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                data-testid="modal-key-name-input"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!keyName.trim()}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                data-testid="modal-create-btn"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {createdKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              API Key Created
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Save this key now.</strong> You won't be able to see it again.
              </p>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-gray-900 rounded-lg font-mono text-sm text-gray-100 flex items-center justify-between gap-4">
                <span className="break-all">{createdKey.full_key}</span>
                <button
                  onClick={handleCopyKey}
                  className="p-2 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
                  data-testid="copy-created-key-btn"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setCreatedKey(null)}
              className="w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              data-testid="close-key-modal-btn"
            >
              I've Saved My Key
            </button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Delete API Key?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All requests using this key will fail.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteKey(deleteConfirm)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                data-testid="confirm-delete-key-btn"
              >
                Delete Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
