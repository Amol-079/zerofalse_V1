import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  Clock,
  Shield,
  X
} from 'lucide-react';
import client from '../api/client';

const APIKeys = () => {
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/api/v1/keys/');
      setKeys(response.data.keys || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    try {
      const response = await client.post('/api/v1/keys/', { name: newKeyName });
      setCreatedKey(response.data);
      setNewKeyName('');
      fetchKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteKey = async (keyId) => {
    try {
      await client.delete(`/api/v1/keys/${keyId}`);
      setKeys(prev => prev.filter(k => k.id !== keyId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key) => {
    if (!key) return '••••••••••••••••';
    return key.substring(0, 8) + '••••••••••••••••';
  };

  return (
    <div className="page-transition" data-testid="api-keys-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            marginBottom: '4px'
          }}>
            API Keys
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Manage your API keys for authentication
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: 'var(--color-brand)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-brand)'
          }}
          data-testid="create-key-btn"
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Create New Key
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: 'var(--color-info-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        marginBottom: '24px'
      }}>
        <Shield style={{ width: '20px', height: '20px', color: 'var(--color-info)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Keep your API keys secure
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            API keys grant access to your organization's scan data. Never share keys in public repositories or client-side code.
          </p>
        </div>
      </div>

      {/* Keys List */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-brand)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : keys.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Key style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              No API keys yet
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: '300px', margin: '0 auto 24px' }}>
              Create your first API key to start scanning tool calls
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'var(--color-brand)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Create API Key
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)' }}>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Name
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Key
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Created
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Used
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((apiKey, index) => (
                <tr 
                  key={apiKey.id || index}
                  style={{ borderTop: '1px solid var(--color-border)' }}
                  data-testid={`key-row-${index}`}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'var(--color-brand-light)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Key style={{ width: '18px', height: '18px', color: 'var(--color-brand)' }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {apiKey.name || 'Unnamed Key'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-surface)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {visibleKeys[apiKey.id] ? apiKey.key_prefix + '...' : maskKey(apiKey.key_prefix)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {visibleKeys[apiKey.id] ? (
                          <EyeOff style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                        ) : (
                          <Eye style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)' }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                        {apiKey.created_at ? new Date(apiKey.created_at).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleString() : 'Never'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => setShowDeleteModal(apiKey)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        backgroundColor: 'var(--color-danger-bg)',
                        color: 'var(--color-danger)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      data-testid={`delete-key-${index}`}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && !createdKey && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            onClick={() => { setShowCreateModal(false); setNewKeyName(''); }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '440px',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 51,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Create New API Key
                </h2>
                <button
                  onClick={() => { setShowCreateModal(false); setNewKeyName(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X style={{ width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />
                </button>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '8px'
              }}>
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Server"
                style={{ width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}
                data-testid="key-name-input"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setShowCreateModal(false); setNewKeyName(''); }}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createKey}
                  disabled={!newKeyName.trim() || isCreating}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: !newKeyName.trim() || isCreating ? 'var(--color-border)' : 'var(--color-brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: !newKeyName.trim() || isCreating ? 'not-allowed' : 'pointer'
                  }}
                  data-testid="confirm-create-key"
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Created Key Modal */}
      {createdKey && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '520px',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 51,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-success-bg)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check style={{ width: '20px', height: '20px', color: 'var(--color-success)' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    API Key Created
                  </h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    Copy this key now — it won't be shown again
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-navy)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    YOUR API KEY
                  </span>
                  <button
                    onClick={() => copyToClipboard(createdKey.key, 'created')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    data-testid="copy-key-btn"
                  >
                    {copiedId === 'created' ? (
                      <>
                        <Check style={{ width: '14px', height: '14px' }} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy style={{ width: '14px', height: '14px' }} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code style={{ 
                  fontSize: 'var(--text-sm)', 
                  fontFamily: 'var(--font-mono)',
                  color: '#e2e8f0',
                  wordBreak: 'break-all'
                }}>
                  {createdKey.key}
                </code>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--color-warning-bg)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <AlertCircle style={{ width: '18px', height: '18px', color: 'var(--color-warning)', flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  Store this key securely. For security reasons, we won't show it again.
                </span>
              </div>

              <button
                onClick={() => { setCreatedKey(null); setShowCreateModal(false); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-brand)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            onClick={() => setShowDeleteModal(null)}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 51,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--color-danger-bg)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Trash2 style={{ width: '28px', height: '28px', color: 'var(--color-danger)' }} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Revoke API Key?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                This will immediately disable <strong>{showDeleteModal.name}</strong>. Any applications using this key will stop working.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteKey(showDeleteModal.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--color-danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  data-testid="confirm-delete-key"
                >
                  Revoke Key
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default APIKeys;
