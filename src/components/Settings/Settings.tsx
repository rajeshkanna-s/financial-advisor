import { useState } from 'react';
import { BsX, BsEye, BsEyeSlash, BsCheckCircle } from 'react-icons/bs';
import type { AppSettings } from '../../types';
import './Settings.css';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(field: keyof AppSettings, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function getApiKeyPlaceholder() {
    switch (form.apiProvider) {
      case 'freemodel': return 'Pre-configured — FreeModel API key';
      case 'gemini': return 'Enter Google Gemini API key...';
      case 'openai': return 'Enter OpenAI API key (sk-...)';
      case 'custom': return 'Enter your API key...';
    }
  }

  function getApiKeyHint() {
    switch (form.apiProvider) {
      case 'freemodel': return 'FreeModel API — pre-configured and ready to use';
      case 'gemini': return 'Get a free key at Google AI Studio (aistudio.google.com/apikey)';
      case 'openai': return 'Get a key at platform.openai.com/api-keys';
      case 'custom': return 'Enter the API key for your custom OpenAI-compatible endpoint';
    }
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>
            <BsX size={24} />
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3>AI Provider</h3>

            <div className="form-group">
              <label>Provider</label>
              <div className="provider-toggle">
                <button
                  className={`provider-btn ${form.apiProvider === 'freemodel' ? 'active' : ''}`}
                  onClick={() => {
                    update('apiProvider', 'freemodel');
                    update('modelName', 'FRE-5.5');
                    update('apiBaseUrl', '/api/freemodel/v1');
                  }}
                >
                  FreeModel
                </button>
                <button
                  className={`provider-btn ${form.apiProvider === 'gemini' ? 'active' : ''}`}
                  onClick={() => {
                    update('apiProvider', 'gemini');
                    update('modelName', 'gemini-2.0-flash');
                    update('apiBaseUrl', '');
                  }}
                >
                  Gemini
                </button>
                <button
                  className={`provider-btn ${form.apiProvider === 'openai' ? 'active' : ''}`}
                  onClick={() => {
                    update('apiProvider', 'openai');
                    update('modelName', 'gpt-4o-mini');
                    update('apiBaseUrl', '/api/openai/v1');
                  }}
                >
                  OpenAI
                </button>
                <button
                  className={`provider-btn ${form.apiProvider === 'custom' ? 'active' : ''}`}
                  onClick={() => {
                    update('apiProvider', 'custom');
                    update('modelName', '');
                    update('apiBaseUrl', '');
                    update('customModelName', '');
                  }}
                >
                  Custom API
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>API Key</label>
              <div className="key-input-wrapper">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={form.apiKey}
                  onChange={e => update('apiKey', e.target.value)}
                  placeholder={getApiKeyPlaceholder()}
                />
                <button className="toggle-key" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
              <small className="form-hint">{getApiKeyHint()}</small>
            </div>

            {form.apiProvider !== 'gemini' && (
              <div className="form-group">
                <label>API Base URL</label>
                <input
                  type="text"
                  value={form.apiBaseUrl}
                  onChange={e => update('apiBaseUrl', e.target.value)}
                  placeholder={form.apiProvider === 'custom' ? 'https://your-api-endpoint.com/v1' : 'https://api.freemodel.dev/v1'}
                />
                <small className="form-hint">
                  {form.apiProvider === 'custom'
                    ? 'Enter the base URL of your OpenAI-compatible API endpoint'
                    : 'Base URL for the API endpoint (OpenAI-compatible format)'}
                </small>
              </div>
            )}

            {form.apiProvider === 'custom' ? (
              <div className="form-group">
                <label>Model Name</label>
                <input
                  type="text"
                  value={form.customModelName}
                  onChange={e => update('customModelName', e.target.value)}
                  placeholder="Enter model name (e.g. gpt-4o, llama-3, mistral-7b)"
                />
                <small className="form-hint">Enter the exact model identifier your API endpoint expects</small>
              </div>
            ) : (
              <div className="form-group">
                <label>Model</label>
                <select
                  value={form.modelName}
                  onChange={e => update('modelName', e.target.value)}
                >
                  {form.apiProvider === 'freemodel' ? (
                    <>
                      <option value="FRE-5.5">FRE-5.5 (Default)</option>
                      <option value="FRE-5.4">FRE-5.4</option>
                      <option value="FRE-5.0">FRE-5.0</option>
                    </>
                  ) : form.apiProvider === 'gemini' ? (
                    <>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast, Free tier)</option>
                      <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Fastest)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Best quality)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o-mini">GPT-4o Mini (Fast, Affordable)</option>
                      <option value="gpt-4o">GPT-4o (Best quality)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>Appearance</h3>

            <div className="form-group">
              <label>Theme</label>
              <div className="provider-toggle">
                <button
                  className={`provider-btn ${form.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => update('theme', 'dark')}
                >
                  Dark
                </button>
                <button
                  className={`provider-btn ${form.theme === 'light' ? 'active' : ''}`}
                  onClick={() => update('theme', 'light')}
                >
                  Light
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Font Size</label>
              <div className="provider-toggle">
                <button
                  className={`provider-btn ${form.fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => update('fontSize', 'small')}
                >
                  Small
                </button>
                <button
                  className={`provider-btn ${form.fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => update('fontSize', 'medium')}
                >
                  Medium
                </button>
                <button
                  className={`provider-btn ${form.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => update('fontSize', 'large')}
                >
                  Large
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Data</h3>
            <p className="section-info">
              All your chat history is stored locally in your browser. Use the Export/Import buttons
              in the sidebar to backup your data. No data is sent to any server except the AI provider.
            </p>
          </div>
        </div>

        <div className="settings-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>
            {saved ? <><BsCheckCircle /> Saved!</> : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
