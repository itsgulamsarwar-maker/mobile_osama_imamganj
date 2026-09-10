'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Settings,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Flame,
  Battery,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Clock,
  Layers,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { MobileItem, SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';
import MobileEditModal from '@/components/admin/MobileEditModal';
import BulkDeleteConfirmModal from '@/components/admin/BulkDeleteConfirmModal';

type AdminTab = 'inventory' | 'settings' | 'backup';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  const [mobiles, setMobiles] = useState<MobileItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'instock' | 'sold' | 'urgent'>('all');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMobile, setEditingMobile] = useState<MobileItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(defaultSiteSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch data on load
  const fetchData = async () => {
    setLoading(true);
    try {
      const [mobilesRes, settingsRes] = await Promise.all([
        fetch('/api/admin/mobiles'),
        fetch('/api/admin/settings'),
      ]);

      const mobilesData = await mobilesRes.json();
      const settingsData = await settingsRes.json();

      if (mobilesData.success) {
        setMobiles(mobilesData.mobiles);
      }
      if (settingsData.success) {
        setSettings(settingsData.settings);
        setSettingsForm(settingsData.settings);
      }
    } catch (err: any) {
      showToast('Error loading store data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered mobiles
  const filteredMobiles = useMemo(() => {
    return mobiles.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.variant && item.variant.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'instock' && !item.isSold) ||
        (selectedStatus === 'sold' && item.isSold) ||
        (selectedStatus === 'urgent' && item.isUrgentSale);

      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [mobiles, searchQuery, selectedBrand, selectedStatus]);

  // Inventory stats
  const stats = useMemo(() => {
    const total = mobiles.length;
    const inStock = mobiles.filter((m) => !m.isSold).length;
    const sold = mobiles.filter((m) => m.isSold).length;
    const urgent = mobiles.filter((m) => m.isUrgentSale).length;
    const totalValue = mobiles
      .filter((m) => !m.isSold)
      .reduce((sum, m) => sum + (m.price || 0), 0);

    return { total, inStock, sold, urgent, totalValue };
  }, [mobiles]);

  // Bulk selection toggles
  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMobiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMobiles.map((m) => m._id));
    }
  };

  // Quick action: Toggle Sold
  const handleToggleSold = async (mobile: MobileItem) => {
    try {
      const newStatus = !mobile.isSold;
      const res = await fetch('/api/admin/mobiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: mobile._id, isSold: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMobiles(mobiles.map((m) => (m._id === mobile._id ? { ...m, isSold: newStatus } : m)));
        showToast(
          newStatus
            ? `Marked "${mobile.title}" as Sold Out (बिक गया)`
            : `Marked "${mobile.title}" as In Stock (उपलब्ध)`
        );
      }
    } catch (err: any) {
      showToast('Error updating status: ' + err.message, 'error');
    }
  };

  // Quick action: Toggle Urgent Deal
  const handleToggleUrgent = async (mobile: MobileItem) => {
    try {
      const newStatus = !mobile.isUrgentSale;
      const res = await fetch('/api/admin/mobiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: mobile._id, isUrgentSale: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMobiles(mobiles.map((m) => (m._id === mobile._id ? { ...m, isUrgentSale: newStatus } : m)));
        showToast(
          newStatus
            ? `Added Urgent Deal badge to "${mobile.title}"`
            : `Removed Urgent Deal badge from "${mobile.title}"`
        );
      }
    } catch (err: any) {
      showToast('Error updating status: ' + err.message, 'error');
    }
  };

  // Quick action: Duplicate phone
  const handleDuplicateMobile = async (mobile: MobileItem) => {
    try {
      const clone = {
        title: `${mobile.title} (Copy)`,
        brand: mobile.brand,
        price: mobile.price,
        originalPrice: mobile.originalPrice,
        variant: mobile.variant,
        condition: mobile.condition,
        batteryHealth: mobile.batteryHealth,
        includes: mobile.includes,
        images: mobile.images,
        isSold: false,
        isUrgentSale: false,
        description: mobile.description,
      };

      const res = await fetch('/api/admin/mobiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clone),
      });
      const data = await res.json();
      if (data.success) {
        setMobiles([data.mobile, ...mobiles]);
        showToast(`Duplicated "${mobile.title}" successfully!`);
      }
    } catch (err: any) {
      showToast('Error duplicating: ' + err.message, 'error');
    }
  };

  // Single delete
  const handleDeleteSingle = async (mobile: MobileItem) => {
    if (!confirm(`Kya aap sach me "${mobile.title}" ko delete karna chahte hain?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/mobiles?id=${mobile._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMobiles(mobiles.filter((m) => m._id !== mobile._id));
        setSelectedIds(selectedIds.filter((i) => i !== mobile._id));
        showToast(`"${mobile.title}" deleted from stock`);
      }
    } catch (err: any) {
      showToast('Delete error: ' + err.message, 'error');
    }
  };

  // Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/mobiles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        const remaining = mobiles.filter((m) => !selectedIds.includes(m._id));
        setMobiles(remaining);
        showToast(`Successfully deleted ${data.deletedCount} mobiles!`);
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
      }
    } catch (err: any) {
      showToast('Bulk delete error: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Status Update (Mark Sold / Available)
  const handleBulkStatusUpdate = async (isSold: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/admin/mobiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, isSold }),
      });
      const data = await res.json();
      if (data.success) {
        const idSet = new Set(selectedIds);
        setMobiles(
          mobiles.map((m) => (idSet.has(m._id) ? { ...m, isSold } : m))
        );
        showToast(
          isSold
            ? `Marked ${selectedIds.length} phones as Sold Out`
            : `Marked ${selectedIds.length} phones as Available In Stock`
        );
        setSelectedIds([]);
      }
    } catch (err: any) {
      showToast('Error updating bulk status: ' + err.message, 'error');
    }
  };

  // Save Mobile (Add or Edit)
  const handleSaveMobile = async (mobileData: Partial<MobileItem>) => {
    const isEdit = Boolean(mobileData._id);
    const endpoint = '/api/admin/mobiles';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mobileData),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to save mobile');
    }

    if (isEdit) {
      setMobiles(mobiles.map((m) => (m._id === data.mobile._id ? data.mobile : m)));
      showToast(`Updated "${data.mobile.title}" successfully!`);
    } else {
      setMobiles([data.mobile, ...mobiles]);
      showToast(`Added new mobile "${data.mobile.title}" to stock!`);
    }
  };

  // Save Store Settings (2nd Hand Mobile Hub name change, etc.)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm.storeName?.trim()) {
      showToast('Store name cannot be empty (दुकान का नाम जरूरी है)', 'error');
      return;
    }

    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showToast('✅ Store Settings & Name Updated Successfully! Website header updated.');
      } else {
        showToast(data.error || 'Error saving settings', 'error');
      }
    } catch (err: any) {
      showToast('Error saving settings: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Reset to default catalog
  const handleResetCatalog = async () => {
    if (
      !confirm(
        'Kya aap catalog ko original 10 verified smartphones aur 2nd Hand Mobile Hub settings par reset karna chahte hain?'
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMobiles(data.data.mobiles);
        setSettings(data.data.settings);
        setSettingsForm(data.data.settings);
        setSelectedIds([]);
        showToast('Catalog restored to default sample data successfully!');
      }
    } catch (err: any) {
      showToast('Reset error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedMobilesObjects = useMemo(() => {
    const idSet = new Set(selectedIds);
    return mobiles.filter((m) => idSet.has(m._id));
  }, [mobiles, selectedIds]);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#080c14]/95 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-20 gap-2">
            {/* Store Branding with Live Dynamic Store Name */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-emerald-400 font-black">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h1 className="text-sm sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                    {settings.storeName || '2nd Hand Mobile Hub'}
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                  <span className="sm:hidden">Imamganj, Gaya</span>
                  <span className="hidden sm:inline">Store Management Dashboard • Gaya, Bihar</span>
                </p>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                title="Open Live Website"
              >
                <span className="hidden sm:inline">Live Shop</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>

              <Link
                href="/admin/studio"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.05] transition-all"
                title="Sanity Studio Headless CMS"
              >
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Sanity Studio</span>
              </Link>

              <button
                onClick={() => {
                  setEditingMobile(null);
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:hidden">Add Phone</span>
                <span className="hidden sm:inline">Add Mobile (नया फोन जोड़ें)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher Sub-header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 border-t border-white/[0.04] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'inventory'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Inventory</span>
            <span className="hidden sm:inline">Mobile Inventory (मोबाइल लिस्ट)</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {mobiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Store Settings</span>
            <span className="hidden sm:inline">Store Settings & Name (दुकान सेटिंग्स & नाम)</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'backup'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Reset Data</span>
            <span className="hidden sm:inline">Reset & Sample Data (डेटा रीसेट)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-medium">
                  <span>Total Phones</span>
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-white mt-1">
                  {stats.total}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Total stock entered</div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-medium">
                  <span>Available</span>
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">
                  {stats.inStock}
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">Ready for sale</div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-medium">
                  <span>Sold Out</span>
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-rose-400 mt-1">
                  {stats.sold}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Marked as sold</div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-[#0d121f] border border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-medium">
                  <span>Urgent Deals</span>
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-amber-400 mt-1">
                  {stats.urgent}
                </div>
                <div className="text-[10px] text-amber-300/80 mt-0.5">Special promo active</div>
              </div>

              <div className="col-span-2 lg:col-span-1 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0d121f] to-teal-950/30 border border-emerald-500/20 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-medium">
                  <span>Active Stock Value</span>
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-white mt-1">
                  ₹{stats.totalValue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Current inventory worth</div>
              </div>
            </div>

            {/* Controls Bar: Search & Status Filters */}
            <div className="bg-[#0b0f19] border border-white/[0.06] rounded-2xl p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search model, brand, variant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      selectedStatus === 'all'
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    All ({mobiles.length})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('instock')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      selectedStatus === 'instock'
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🟢 In Stock ({stats.inStock})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('sold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      selectedStatus === 'sold'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔴 Sold Out ({stats.sold})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('urgent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      selectedStatus === 'urgent'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔥 Urgent ({stats.urgent})
                  </button>
                </div>
              </div>
            </div>

            {/* BULK ACTION BAR (Visible when 1 or more items selected) */}
            {selectedIds.length > 0 && (
              <div className="sticky top-20 z-30 bg-gradient-to-r from-rose-950/95 via-slate-900/95 to-purple-950/95 border border-rose-500/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
                <div className="flex items-center justify-between sm:justify-start space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {selectedIds.length} phone{selectedIds.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 underline sm:hidden"
                  >
                    Deselect
                  </button>
                </div>

                <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleBulkStatusUpdate(true)}
                    className="flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors text-center"
                  >
                    Sold (बिक गया)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkStatusUpdate(false)}
                    className="flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors text-center"
                  >
                    In Stock (उपलब्ध)
                  </button>

                  {/* Multiple Delete Button */}
                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="hidden sm:inline-block text-slate-400 hover:text-white text-xs px-2 py-1 underline"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            )}

            {/* INVENTORY DATA TABLE */}
            <div className="bg-[#0b0f19] border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading inventory phones...</p>
                </div>
              ) : filteredMobiles.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Smartphone className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Phones Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Aapke search ya filter se koi phone match nahi kiya. Naya mobile jodne ke liye
                    upar &quot;Add Mobile&quot; par click karein.
                  </p>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW (< 768px): Touch-Friendly Native Mobile Cards */}
                  <div className="block md:hidden p-3 space-y-3">
                    {/* Mobile Select All Control */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/70 rounded-2xl border border-white/[0.06] text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 font-bold"
                      >
                        {selectedIds.length > 0 && selectedIds.length === filteredMobiles.length ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Select All ({filteredMobiles.length} Phones)</span>
                      </button>
                      {selectedIds.length > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {selectedIds.length} Selected
                        </span>
                      )}
                    </div>

                    {/* Mobile Phone Cards List */}
                    {filteredMobiles.map((mobile) => {
                      const isSelected = selectedIds.includes(mobile._id);
                      const imgSrc =
                        mobile.images && mobile.images.length > 0
                          ? getImageSrc(mobile.images[0])
                          : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';

                      const discountPercent =
                        mobile.originalPrice && mobile.originalPrice > mobile.price
                          ? Math.round(
                              ((mobile.originalPrice - mobile.price) / mobile.originalPrice) * 100
                            )
                          : null;

                      return (
                        <div
                          key={`mobile-card-${mobile._id}`}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-emerald-500/[0.08] border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                              : 'bg-slate-900/60 border-white/[0.07]'
                          } ${mobile.isSold ? 'opacity-75' : ''}`}
                        >
                          {/* Row 1: Checkbox, Thumbnail, Title & Badges */}
                          <div className="flex items-start space-x-3">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(mobile._id)}
                              className="mt-1 text-slate-400 hover:text-emerald-400 shrink-0"
                              aria-label="Select mobile"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-500" />
                              )}
                            </button>

                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-white/[0.1] shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgSrc}
                                alt={mobile.title}
                                className="w-full h-full object-cover"
                              />
                              {mobile.images && mobile.images.length > 1 && (
                                <span className="absolute bottom-0.5 right-0.5 text-[9px] font-black px-1 rounded bg-black/85 text-white">
                                  +{mobile.images.length - 1}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-white text-sm leading-snug line-clamp-2">
                                {mobile.title}
                              </h4>
                              <div className="flex items-center space-x-1.5 mt-1 flex-wrap gap-1">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {mobile.brand}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {mobile.variant}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Price & Specs */}
                          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="text-base font-black text-emerald-400">
                                ₹{mobile.price.toLocaleString('en-IN')}
                              </div>
                              {mobile.originalPrice && mobile.originalPrice > mobile.price && (
                                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                                  <span className="line-through">
                                    ₹{mobile.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                  {discountPercent && (
                                    <span className="text-emerald-400 font-bold">
                                      {discountPercent}% OFF
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right space-y-1">
                              <div className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-300 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>{mobile.condition}</span>
                              </div>
                              {mobile.batteryHealth && (
                                <div className="flex items-center justify-end space-x-1 text-[10px] text-cyan-400 font-semibold">
                                  <Battery className="w-3 h-3" />
                                  <span>Battery: {mobile.batteryHealth}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Row 3: 1-Tap Quick Toggles (Sold / Available & Urgent Deal) */}
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSold(mobile)}
                              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                                mobile.isSold
                                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/50'
                                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                              }`}
                            >
                              <span>{mobile.isSold ? '🔴 Sold (बिका)' : '🟢 Available (स्टॉक)'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleUrgent(mobile)}
                              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                                mobile.isUrgentSale
                                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-950/50'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <Flame
                                className={`w-3.5 h-3.5 ${
                                  mobile.isUrgentSale ? 'text-amber-400 fill-amber-400' : ''
                                }`}
                              />
                              <span>{mobile.isUrgentSale ? '🔥 Urgent Deal' : 'Regular Sale'}</span>
                            </button>
                          </div>

                          {/* Row 4: Action Buttons (Edit Details, Duplicate, Delete) */}
                          <div className="mt-2.5 flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMobile(mobile);
                                setIsEditModalOpen(true);
                              }}
                              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Phone Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicateMobile(mobile)}
                              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 active:scale-95 transition-all"
                              title="Duplicate Phone"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSingle(mobile)}
                              className="p-2.5 rounded-xl bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 border border-rose-500/30 active:scale-95 transition-all"
                              title="Delete Phone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DESKTOP VIEW (>= 768px): Full 6-Column Data Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-slate-900/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {/* Select All Checkbox */}
                          <th className="p-3.5 sm:p-4 w-10">
                            <button
                              type="button"
                              onClick={handleSelectAll}
                              className="text-slate-400 hover:text-emerald-400"
                              title="Select / Deselect All"
                            >
                              {selectedIds.length > 0 &&
                              selectedIds.length === filteredMobiles.length ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </th>
                          <th className="p-3.5 sm:p-4">Photo & Model</th>
                          <th className="p-3.5 sm:p-4">Price / MRP</th>
                          <th className="p-3.5 sm:p-4">Specs & Condition</th>
                          <th className="p-3.5 sm:p-4">Quick Status</th>
                          <th className="p-3.5 sm:p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05] text-xs">
                        {filteredMobiles.map((mobile) => {
                          const isSelected = selectedIds.includes(mobile._id);
                          const imgSrc =
                            mobile.images && mobile.images.length > 0
                              ? getImageSrc(mobile.images[0])
                              : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';

                          const discountPercent =
                            mobile.originalPrice && mobile.originalPrice > mobile.price
                              ? Math.round(
                                  ((mobile.originalPrice - mobile.price) / mobile.originalPrice) * 100
                                )
                              : null;

                          return (
                            <tr
                              key={mobile._id}
                              className={`hover:bg-white/[0.02] transition-colors ${
                                isSelected ? 'bg-emerald-500/[0.06]' : ''
                              } ${mobile.isSold ? 'opacity-70' : ''}`}
                            >
                              {/* Row Checkbox */}
                              <td className="p-3.5 sm:p-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelect(mobile._id)}
                                  className="text-slate-400 hover:text-emerald-400"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              </td>

                              {/* Photo & Title */}
                              <td className="p-3.5 sm:p-4 min-w-[200px]">
                                <div className="flex items-center space-x-3">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08] shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={imgSrc}
                                      alt={mobile.title}
                                      className="w-full h-full object-cover"
                                    />
                                    {mobile.images && mobile.images.length > 1 && (
                                      <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded bg-black/80 text-white">
                                        +{mobile.images.length - 1}
                                      </span>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="font-bold text-white text-sm truncate flex items-center space-x-1.5">
                                      <span>{mobile.title}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                        {mobile.brand}
                                      </span>
                                      <span className="text-[11px] text-slate-400 truncate">
                                        {mobile.variant}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Price / MRP */}
                              <td className="p-3.5 sm:p-4">
                                <div className="font-extrabold text-sm text-emerald-400">
                                  ₹{mobile.price.toLocaleString('en-IN')}
                                </div>
                                {mobile.originalPrice && mobile.originalPrice > mobile.price && (
                                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                                    <span className="line-through">
                                      ₹{mobile.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                    {discountPercent && (
                                      <span className="text-emerald-400 font-bold">
                                        {discountPercent}% OFF
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Specs & Condition */}
                              <td className="p-3.5 sm:p-4">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{mobile.condition}</span>
                                  </div>
                                  {mobile.batteryHealth && (
                                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                                      <Battery className="w-3 h-3 text-cyan-400" />
                                      <span>Battery: {mobile.batteryHealth}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 1-Click Status Toggles */}
                              <td className="p-3.5 sm:p-4">
                                <div className="flex flex-col space-y-1.5">
                                  {/* Sold / In Stock Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSold(mobile)}
                                    className={`inline-flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                                      mobile.isSold
                                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-300 hover:bg-rose-900/40'
                                        : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                                    }`}
                                    title="Click to toggle Sold / In Stock"
                                  >
                                    <span>{mobile.isSold ? '🔴 Sold' : '🟢 Available'}</span>
                                  </button>

                                  {/* Urgent Deal Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUrgent(mobile)}
                                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                                      mobile.isUrgentSale
                                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                    title="Click to toggle Urgent Sale Deal"
                                  >
                                    <Flame
                                      className={`w-3 h-3 ${
                                        mobile.isUrgentSale ? 'text-amber-400 fill-amber-400' : ''
                                      }`}
                                    />
                                    <span>{mobile.isUrgentSale ? 'Urgent Deal' : 'Regular'}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Action Buttons */}
                              <td className="p-3.5 sm:p-4 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateMobile(mobile)}
                                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                                    title="Duplicate Mobile"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMobile(mobile);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold text-xs transition-colors"
                                    title="Edit Phone"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Delete Single Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSingle(mobile)}
                                    className="p-1.5 rounded-lg bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 border border-rose-500/20 transition-colors"
                                    title="Delete Phone"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STORE SETTINGS & STORE NAME (2nd Hand Mobile Hub) */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {/* Live Header Preview Box */}
            <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Live Website Preview (वेबसाइट पर कैसा दिखेगा)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  REAL-TIME PREVIEW
                </span>
              </div>

              {/* Mock Header display */}
              <div className="bg-[#080c14] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1.5px]">
                    <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-black text-white">
                      {settingsForm.storeName || '2nd Hand Mobile Hub'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {settingsForm.storeTagline || 'Imamganj • Second Hand Mobile Hub'}
                    </div>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-end space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{settingsForm.phone || '+91 9102609396'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{settingsForm.address || 'Kolkata Bus Stand, Imamganj'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* 1. Store Identity */}
              <div className="bg-[#0b0f19] border border-white/[0.08] rounded-3xl p-5 sm:p-7 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>1. Store Identity & Name (दुकान का नाम और पहचान)</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Store Name (दुकान का नाम) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Hand Mobile Hub"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-base focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ye naam poori website ke header, hero, footer, title aur WhatsApp messages me
                    turant dikhega.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Store Tagline / Subtitle (टैगलाइन)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Certified 2nd Hand Smartphones • Kolkata Bus Stand, Imamganj, Gaya"
                    value={settingsForm.storeTagline || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeTagline: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Contact & Address */}
              <div className="bg-[#0b0f19] border border-white/[0.08] rounded-3xl p-5 sm:p-7 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>2. Contact & Address (फोन नंबर और पता)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Number (कस्टमर चैट के लिए) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 919102609396 (bina space ya + ke)"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Calling Phone Number (कॉलिंग नंबर) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 9102609396"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Shop Physical Address (दुकान का पूरा पता) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kolkata Bus Stand, Imamganj, Gaya, Bihar"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Instagram Handle (इंस्टाग्राम)
                    </label>
                    <div className="relative">
                      <Instagram className="w-4 h-4 text-pink-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. @second_hand_mobile_hub1"
                        value={settingsForm.instagramHandle || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Instagram Profile Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/..."
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Store Timings / Opening Hours (खुलने का समय)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM"
                      value={settingsForm.openingHours || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, openingHours: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Urgent Sale Offer & Promo Banner */}
              <div className="bg-[#0b0f19] border border-white/[0.08] rounded-3xl p-5 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>3. Urgent Offer Banner (अर्जेंट सेल ऑफर बैनर)</span>
                  </h3>

                  {/* Toggle Banner Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        showPromoBanner: !settingsForm.showPromoBanner,
                      })
                    }
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      settingsForm.showPromoBanner
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{settingsForm.showPromoBanner ? '🟢 Banner ON' : '⚪ Banner OFF'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Promo Badge Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🔥 URGENT SELLING OFFER"
                      value={settingsForm.promoTag || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoTag: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="Claim Offer on WhatsApp"
                      value={settingsForm.promoButtonText || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, promoButtonText: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Offer Headline Title (ऑफर हेडिंग)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat ₹2,000 Extra Off on all 5G Phones This Week!"
                    value={settingsForm.promoTitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, promoTitle: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Offer Details / Free Gifts (ऑफर विवरण)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Free 20W Fast Charger + Original Back Cover with every purchase..."
                    value={settingsForm.promoDescription || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, promoDescription: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm font-black shadow-xl shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50"
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Save Store Settings (सेटिंग्स सेव करें)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto bg-[#0b0f19] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                <span>Reset / Restore Catalog (कैटलॉग रीसेट करें)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Agar aapke store catalog me koi test phone ya galti ho gayi ho aur aap original 10
                phones (iPhone 14 Pro, Galaxy S23 Ultra, Pixel 7 Pro, etc.) aur 2nd Hand Mobile Hub
                settings ko wapas laana chahte hain, toh yahan se 1-click me reset kar sakte hain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300">
              ⚠️ <strong>Note:</strong> Reset karne par current custom inventory replace hokar 10
              original phones se restore ho jayegi.
            </div>

            <button
              type="button"
              onClick={handleResetCatalog}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Restore 10 Verified Phones & Reset Catalog</span>
            </button>
          </div>
        )}
      </main>

      {/* Edit / Add Modal */}
      <MobileEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMobile(null);
        }}
        onSave={handleSaveMobile}
        initialData={editingMobile}
      />

      {/* Bulk Delete Confirm Modal */}
      <BulkDeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        selectedMobiles={selectedMobilesObjects}
        isDeleting={isDeleting}
      />
    </div>
  );
}
