import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import client from '../api/client';
import { User, Building, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePassword } from '../utils/validators';

export default function Settings() {
  const { user, org, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [webhookData, setWebhookData] = useState({
    url: '',
    events: ['scan.blocked', 'alert.critical'],
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    const validation = validatePassword(passwordData.new_password);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    try {
      await client.post('/api/v1/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setSuccess('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className=\"space-y-6\" data-testid=\"settings-page\">
      <div>
        <h1 className=\"text-3xl font-bold text-gray-900\" style={{ fontFamily: 'Syne, sans-serif' }}>
          Settings
        </h1>
        <p className=\"text-gray-600 mt-1\">Manage your account and preferences</p>
      </div>

      <div className=\"flex gap-6\">
        <div className=\"w-64 bg-white rounded-xl border border-gray-200 p-4 h-fit\">
          <nav className=\"space-y-1\">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  data-testid={`settings-tab-${tab.id}`}
                >
                  <Icon className=\"w-5 h-5\" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className=\"flex-1 bg-white rounded-xl border border-gray-200 p-8\">
          {activeTab === 'profile' && (
            <div>
              <h2 className=\"text-xl font-bold text-gray-900 mb-6\" style={{ fontFamily: 'Syne, sans-serif' }}>
                Profile Settings
              </h2>

              <div className=\"space-y-6 mb-8\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Full Name</label>\n                  <input
                    type=\"text\"
                    defaultValue={user?.full_name || ''}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent\"
                    disabled
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Email</label>\n                  <input
                    type=\"email\"
                    defaultValue={user?.email || ''}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50\"
                    disabled
                  />
                </div>
              </div>

              <div className=\"border-t border-gray-200 pt-8\">
                <h3 className=\"text-lg font-semibold text-gray-900 mb-6\">Change Password</h3>

                {success && (
                  <div className=\"mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 flex-shrink-0\" />
                    <span className=\"text-sm text-green-800\">{success}</span>
                  </div>
                )}

                {error && (
                  <div className=\"mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3\">
                    <AlertCircle className=\"w-5 h-5 text-red-600 flex-shrink-0\" />
                    <span className=\"text-sm text-red-800\">{error}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className=\"space-y-5\">
                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 mb-2\">Current Password</label>
                    <input
                      type=\"password\"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className=\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent\"
                      required
                    />
                  </div>

                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 mb-2\">New Password</label>
                    <input
                      type=\"password\"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className=\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent\"
                      required
                    />
                  </div>

                  <div>
                    <label className=\"block text-sm font-medium text-gray-700 mb-2\">Confirm New Password</label>
                    <input
                      type=\"password\"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className=\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent\"
                      required
                    />
                  </div>

                  <button
                    type=\"submit\"
                    disabled={loading}
                    className=\"px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50\"
                    data-testid=\"change-password-btn\"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'organization' && (
            <div>
              <h2 className=\"text-xl font-bold text-gray-900 mb-6\" style={{ fontFamily: 'Syne, sans-serif' }}>
                Organization Settings
              </h2>

              <div className=\"space-y-6\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Organization Name</label>
                  <input
                    type=\"text\"
                    defaultValue={org?.name || ''}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50\"
                    disabled
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Plan</label>
                  <div className=\"px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 capitalize font-semibold\">
                    {org?.plan || 'free'}
                  </div>
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Scan Quota</label>
                  <div className=\"px-4 py-3 border border-gray-300 rounded-lg bg-gray-50\">
                    {org?.scan_count_month?.toLocaleString() || 0} / {org?.scan_limit_month?.toLocaleString() || 0} scans this month
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className=\"text-xl font-bold text-gray-900 mb-6\" style={{ fontFamily: 'Syne, sans-serif' }}>
                Webhook Configuration
              </h2>

              <form className=\"space-y-6\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Webhook URL</label>
                  <input
                    type=\"url\"
                    value={webhookData.url}
                    onChange={(e) => setWebhookData({ ...webhookData, url: e.target.value })}
                    placeholder=\"https://your-app.com/webhooks/zerofalse\"
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent\"
                  />
                </div>

                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-3\">Event Types</label>
                  <div className=\"space-y-2\">
                    {['scan.blocked', 'alert.critical', 'alert.high', 'quota.warning'].map((event) => (\n                      <label key={event} className=\"flex items-center gap-3 cursor-pointer\">\n                        <input\n                          type=\"checkbox\"
                          checked={webhookData.events.includes(event)}\n                          onChange={(e) => {\n                            if (e.target.checked) {\n                              setWebhookData({ ...webhookData, events: [...webhookData.events, event] });\n                            } else {\n                              setWebhookData({\n                                ...webhookData,\n                                events: webhookData.events.filter((ev) => ev !== event),\n                              });\n                            }\n                          }}\n                          className=\"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600\"\n                        />\n                        <span className=\"text-sm text-gray-700\">{event}</span>\n                      </label>\n                    ))}\n                  </div>\n                </div>\n\n                <div className=\"flex gap-3\">\n                  <button\n                    type=\"button\"\n                    className=\"px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors\"\n                  >\n                    Test Webhook\n                  </button>\n                  <button\n                    type=\"submit\"\n                    className=\"px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors\"\n                  >\n                    Save Configuration\n                  </button>\n                </div>\n              </form>\n            </div>\n          )}
        </div>
      </div>
    </div>
  );
}
