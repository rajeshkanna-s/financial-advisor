import type { Chat, AppSettings } from '../types';

const CHATS_KEY = 'fa_chats';
const SETTINGS_KEY = 'fa_settings';

const defaultSettings: AppSettings = {
  apiKey: 'fe_oa_0a8b5431a4269674b7b9a5ea796bd0b6ca31e56a47ba4466',
  apiProvider: 'freemodel',
  apiBaseUrl: '/api/freemodel/v1',
  modelName: 'FRE-5.5',
  customModelName: '',
  theme: 'dark',
  storagePath: '',
  fontSize: 'medium',
};

export function loadChats(): Chat[] {
  try {
    const data = localStorage.getItem(CHATS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function saveChat(chat: Chat): void {
  const chats = loadChats();
  const idx = chats.findIndex(c => c.id === chat.id);
  if (idx >= 0) {
    chats[idx] = chat;
  } else {
    chats.unshift(chat);
  }
  saveChats(chats);
}

export function deleteChat(chatId: string): void {
  const chats = loadChats().filter(c => c.id !== chatId);
  saveChats(chats);
}

export function clearAllChats(): void {
  localStorage.removeItem(CHATS_KEY);
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportChats(): string {
  const chats = loadChats();
  return JSON.stringify(chats, null, 2);
}

export function importChats(jsonString: string): boolean {
  try {
    const chats: Chat[] = JSON.parse(jsonString);
    if (!Array.isArray(chats)) return false;
    const existing = loadChats();
    const existingIds = new Set(existing.map(c => c.id));
    const newChats = chats.filter(c => !existingIds.has(c.id));
    saveChats([...newChats, ...existing]);
    return true;
  } catch {
    return false;
  }
}

export async function exportToFile(): Promise<void> {
  const data = exportChats();
  const blob = new Blob([data], { type: 'application/json' });

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `financial-advisor-backup-${new Date().toISOString().split('T')[0]}.json`,
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (e: any) {
      if (e.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial-advisor-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromFile(): Promise<boolean> {
  return new Promise((resolve) => {
    if ('showOpenFilePicker' in window) {
      (window as any).showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      }).then(async ([handle]: any) => {
        const file = await handle.getFile();
        const text = await file.text();
        resolve(importChats(text));
      }).catch(() => resolve(false));
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(false); return; }
      const text = await file.text();
      resolve(importChats(text));
    };
    input.click();
  });
}

export function getChatsByCategory(category: string): Chat[] {
  return loadChats().filter(c => c.category === category);
}

export function searchChats(query: string): Chat[] {
  const lower = query.toLowerCase();
  return loadChats().filter(chat =>
    chat.title.toLowerCase().includes(lower) ||
    chat.messages.some(m => m.content.toLowerCase().includes(lower))
  );
}
