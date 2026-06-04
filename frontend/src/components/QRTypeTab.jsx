/* src/components/QRTypeTab.jsx
   Horizontal tab bar for selecting QR content type.
*/
import React from 'react';
import { LucideIcon } from 'lucide-react'; // assuming lucide-react is installed

const TABS = [
  { id: 'url',       label: 'URL',        icon: '🔗' },
  { id: 'twitter',   label: 'X / Twitter', icon: '✖' },
  { id: 'facebook',  label: 'Facebook',   icon: '👤' },
  { id: 'instagram', label: 'Instagram',  icon: '📸' },
  { id: 'linkedin',  label: 'LinkedIn',   icon: '💼' },
  { id: 'whatsapp',  label: 'WhatsApp',   icon: '💬' },
  { id: 'email',     label: 'Email',      icon: '✉' },
  { id: 'phone',     label: 'Phone',      icon: '📞' },
  { id: 'sms',       label: 'SMS',        icon: '💬' },
  { id: 'wifi',      label: 'WiFi',       icon: '📶' },
  { id: 'vcard',     label: 'vCard',      icon: '👤' },
  { id: 'text',      label: 'Free Text',  icon: '📝' },
];

export default function QRTypeTab({ activeTab, onSelect }) {
  return (
    <div className="qr-type-tab" style={{
      display: 'flex',
      gap: '4px',
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: '14px',
      padding: '5px',
      marginBottom: '24px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`qr-tab-button ${activeTab === tab.id ? 'active' : ''}`}
          style={{
            position: 'relative',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === tab.id ? 'var(--coral)' : 'var(--muted)',
            cursor: 'pointer',
            transition: 'all 0.18s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <span style={{ fontSize: '15px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
          {activeTab === tab.id && (
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '20%',
              right: '20%',
              height: '2.5px',
              background: 'var(--coral)',
              borderRadius: '99px',
            }} />
          )}
        </button>
      ))}
    </div>
  );
}
