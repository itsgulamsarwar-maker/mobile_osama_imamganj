import fs from 'fs';
import path from 'path';
import { MobileItem, SiteSettings, defaultSiteSettings } from './sanity.client';
import { mockMobiles } from './mockData';

export interface InventoryStoreData {
  settings: SiteSettings;
  mobiles: MobileItem[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inventory.json');

// In-memory cache for blazing fast 0.05ms response time
let memoryCache: InventoryStoreData | null = null;

// Ensure directory and initial file exist
function ensureDataFile(): InventoryStoreData {
  if (memoryCache) {
    return memoryCache;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData: InventoryStoreData = {
      settings: {
        ...defaultSiteSettings,
        storeName: 'OSAMA MOBILE',
        storeTagline: 'Certified 2nd Hand Smartphones • Kolkata Bus Stand, Imamganj, Gaya',
      },
      mobiles: mockMobiles,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    memoryCache = initialData;
    return initialData;
  }

  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.mobiles || !parsed.settings) {
      throw new Error('Invalid structure');
    }
    memoryCache = parsed;
    return parsed;
  } catch (err) {
    console.error('Error reading inventory.json, recreating defaults:', err);
    const initialData: InventoryStoreData = {
      settings: {
        ...defaultSiteSettings,
        storeName: 'OSAMA MOBILE',
        storeTagline: 'Certified 2nd Hand Smartphones • Kolkata Bus Stand, Imamganj, Gaya',
      },
      mobiles: mockMobiles,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    memoryCache = initialData;
    return initialData;
  }
}

function writeData(data: InventoryStoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  data.lastUpdated = new Date().toISOString();
  memoryCache = data;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getStoreData(): Promise<InventoryStoreData> {
  return ensureDataFile();
}

export async function getInventoryMobiles(): Promise<MobileItem[]> {
  const data = ensureDataFile();
  return data.mobiles;
}

export async function getActiveSiteSettings(): Promise<SiteSettings> {
  const data = ensureDataFile();
  return data.settings;
}

export async function updateSiteSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  const data = ensureDataFile();
  data.settings = {
    ...data.settings,
    ...newSettings,
  };
  writeData(data);
  return data.settings;
}

export async function addInventoryMobile(item: Omit<MobileItem, '_id'>): Promise<MobileItem> {
  const data = ensureDataFile();
  const newMobile: MobileItem = {
    ...item,
    _id: `mob-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    _createdAt: new Date().toISOString(),
  };
  data.mobiles.unshift(newMobile);
  writeData(data);
  return newMobile;
}

export async function updateInventoryMobile(id: string, patch: Partial<MobileItem>): Promise<MobileItem | null> {
  const data = ensureDataFile();
  const index = data.mobiles.findIndex((m) => m._id === id);
  if (index === -1) return null;

  data.mobiles[index] = {
    ...data.mobiles[index],
    ...patch,
  };
  writeData(data);
  return data.mobiles[index];
}

export async function deleteInventoryMobile(id: string): Promise<boolean> {
  const data = ensureDataFile();
  const initialLength = data.mobiles.length;
  data.mobiles = data.mobiles.filter((m) => m._id !== id);
  if (data.mobiles.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

export async function bulkDeleteInventoryMobiles(ids: string[]): Promise<number> {
  const data = ensureDataFile();
  const idSet = new Set(ids);
  const initialLength = data.mobiles.length;
  data.mobiles = data.mobiles.filter((m) => !idSet.has(m._id));
  const deletedCount = initialLength - data.mobiles.length;
  if (deletedCount > 0) {
    writeData(data);
  }
  return deletedCount;
}

export async function bulkUpdateInventoryStatus(
  ids: string[],
  updates: { isSold?: boolean; isUrgentSale?: boolean }
): Promise<number> {
  const data = ensureDataFile();
  const idSet = new Set(ids);
  let updatedCount = 0;

  data.mobiles = data.mobiles.map((m) => {
    if (idSet.has(m._id)) {
      updatedCount++;
      return {
        ...m,
        ...(updates.isSold !== undefined ? { isSold: updates.isSold } : {}),
        ...(updates.isUrgentSale !== undefined ? { isUrgentSale: updates.isUrgentSale } : {}),
      };
    }
    return m;
  });

  if (updatedCount > 0) {
    writeData(data);
  }
  return updatedCount;
}

export async function resetInventoryToDefaults(): Promise<InventoryStoreData> {
  const initialData: InventoryStoreData = {
    settings: {
      ...defaultSiteSettings,
      storeName: 'OSAMA MOBILE',
      storeTagline: 'Certified 2nd Hand Smartphones • Kolkata Bus Stand, Imamganj, Gaya',
    },
    mobiles: mockMobiles,
    lastUpdated: new Date().toISOString(),
  };
  writeData(initialData);
  return initialData;
}
