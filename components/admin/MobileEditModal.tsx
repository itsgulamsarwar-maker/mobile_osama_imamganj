'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Sparkles,
  Smartphone,
  Battery,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  FileCheck,
  Zap,
  Star,
} from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';
import { compressImage, formatFileSize } from '@/lib/imageCompressor';

const BRANDS = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Vivo',
  'Realme',
  'Xiaomi',
  'Oppo',
  'Google',
  'Other',
] as const;

const CONDITIONS = ['Like New (10/10)', 'Good', 'Fair'] as const;

const COMMON_ACCESSORIES = [
  'Box',
  'Original Charger',
  'Bill',
  'Cable',
  'Back Cover',
  'Tempered Glass',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1000&auto=format&fit=crop&q=80',
];

interface MobileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mobileData: Partial<MobileItem>) => Promise<void>;
  initialData?: MobileItem | null;
}

export default function MobileEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MobileEditModalProps) {
  const isEditing = Boolean(initialData?._id);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState<any>('Apple');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [variant, setVariant] = useState('128GB / 6GB RAM');
  const [condition, setCondition] = useState<'Like New (10/10)' | 'Good' | 'Fair'>('Like New (10/10)');
  const [batteryHealth, setBatteryHealth] = useState('92%');
  const [includes, setIncludes] = useState<string[]>(['Box', 'Original Charger', 'Cable']);
  const [customAccessory, setCustomAccessory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSold, setIsSold] = useState(false);
  const [isUrgentSale, setIsUrgentSale] = useState(false);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Image upload & compression states
  const [compressing, setCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    reduction: number;
    count: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setBrand(initialData.brand || 'Apple');
      setPrice(initialData.price?.toString() || '');
      setOriginalPrice(initialData.originalPrice?.toString() || '');
      setVariant(initialData.variant || '128GB / 6GB RAM');
      setCondition(initialData.condition || 'Like New (10/10)');
      setBatteryHealth(initialData.batteryHealth || '90%');
      setIncludes(initialData.includes || ['Box', 'Cable']);
      setIsSold(Boolean(initialData.isSold));
      setIsUrgentSale(Boolean(initialData.isUrgentSale));
      setDescription(initialData.description || '');

      // Parse images to string URLs
      const extractedImages: string[] = [];
      if (Array.isArray(initialData.images)) {
        initialData.images.forEach((img: any) => {
          const src = getImageSrc(img);
          if (src) extractedImages.push(src);
        });
      }
      setImages(extractedImages.length > 0 ? extractedImages : [SAMPLE_IMAGES[0]]);
    } else {
      // Defaults for new phone
      setTitle('');
      setBrand('Apple');
      setPrice('');
      setOriginalPrice('');
      setVariant('128GB / 6GB RAM');
      setCondition('Like New (10/10)');
      setBatteryHealth('95%');
      setIncludes(['Box', 'Original Charger', 'Cable']);
      setIsSold(false);
      setIsUrgentSale(false);
      setDescription('');
      setImages([SAMPLE_IMAGES[0]]);
    }
    setErrorMsg('');
    setCompressionStats(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const numPrice = Number(price) || 0;
  const numOrigPrice = Number(originalPrice) || 0;
  const discountPercent =
    numOrigPrice > numPrice && numOrigPrice > 0
      ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
      : null;

  const handleToggleAccessory = (acc: string) => {
    if (includes.includes(acc)) {
      setIncludes(includes.filter((i) => i !== acc));
    } else {
      setIncludes([...includes, acc]);
    }
  };

  const handleAddCustomAccessory = () => {
    if (!customAccessory.trim()) return;
    if (!includes.includes(customAccessory.trim())) {
      setIncludes([...includes, customAccessory.trim()]);
    }
    setCustomAccessory('');
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0 || index >= images.length) return;
    const newArr = [...images];
    const item = newArr.splice(index, 1)[0];
    newArr.unshift(item);
    setImages(newArr);
  };

  // High-performance image upload with automatic client-side compression
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setCompressing(true);
    setErrorMsg('');

    let totalOriginal = 0;
    let totalCompressed = 0;
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // 1. Automatically compress large mobile phone photos in browser
        const result = await compressImage(file, 1200, 1200, 0.82);
        totalOriginal += result.originalSize;
        totalCompressed += result.compressedSize;

        // 2. Upload compressed file to server
        const formData = new FormData();
        formData.append('file', result.file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        const reduction = Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100);
        setCompressionStats({
          originalSize: totalOriginal,
          compressedSize: totalCompressed,
          reduction: Math.max(0, reduction),
          count: uploadedUrls.length,
        });
      }
    } catch (err: any) {
      console.error('Upload & compress error:', err);
      setErrorMsg('Image upload failed: ' + err.message);
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter Mobile Title (फोन का नाम जरूरी है)');
      return;
    }
    if (!numPrice || numPrice <= 0) {
      setErrorMsg('Please enter valid Selling Price (सही कीमत भरें)');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload: Partial<MobileItem> = {
        title: title.trim(),
        brand,
        price: numPrice,
        originalPrice: numOrigPrice > 0 ? numOrigPrice : undefined,
        variant: variant.trim() || '128GB / 6GB RAM',
        condition,
        batteryHealth: batteryHealth.trim() || undefined,
        includes,
        images,
        isSold,
        isUrgentSale,
        description: description.trim() || undefined,
      };

      if (initialData?._id) {
        payload._id = initialData._id;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save mobile details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0b0f19] border border-emerald-500/30 rounded-3xl w-full max-w-4xl my-auto shadow-2xl shadow-emerald-950/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {isEditing ? 'Edit Mobile Details (फोन एडिट करें)' : 'Add New Mobile (नया फोन जोड़ें)'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing ? `Editing: ${initialData?.title}` : 'Fill in phone details with automatic image compression'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>1. Basic Details (नाम और ब्रांड)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Model Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 14 Pro 128GB - Deep Purple"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Brand (ब्रांड) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Variant (RAM / Storage)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 128GB / 6GB RAM or 256GB / 8GB"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Battery Health (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 92% or 88%"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                  <Battery className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Discount */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Pricing & Savings (कीमत और डिस्काउंट)</span>
              </h3>
              {discountPercent !== null && (
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {discountPercent}% OFF • Save ₹{(numOrigPrice - numPrice).toLocaleString('en-IN')}!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Selling Price (दुकान की कीमत ₹) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 26500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Original / Launch Price (नई MRP ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 59900 (strike-through MRP)"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Condition & Status Flags */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Condition & Stock Status (हालत और स्टॉक)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Physical Condition (हालत)
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Switch: In Stock / Sold Out */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Stock Status (स्टॉक स्टेटस)
                </label>
                <button
                  type="button"
                  onClick={() => setIsSold(!isSold)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isSold
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  <span>{isSold ? '🔴 Sold Out (बिक गया)' : '🟢 Available (दुकान में उपलब्ध)'}</span>
                  <span className="text-[10px] underline ml-1">Toggle</span>
                </button>
              </div>

              {/* Status Switch: Urgent Sale Deal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Urgent Sale Deal? (अर्जेंट सेल)
                </label>
                <button
                  type="button"
                  onClick={() => setIsUrgentSale(!isUrgentSale)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isUrgentSale
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/40'
                      : 'bg-slate-950 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="flex items-center">
                    <Flame className={`w-3.5 h-3.5 mr-1 ${isUrgentSale ? 'text-amber-400 fill-amber-400' : ''}`} />
                    {isUrgentSale ? '🔥 Urgent Sale Active' : 'Normal Item'}
                  </span>
                  <span className="text-[10px] underline ml-1">Toggle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Automatic Image Compression & Photos Upload */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>4. Mobile Photos with Auto-Compression (फोटो कंप्रेस और अपलोड)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>AUTO-COMPRESS ACTIVE</span>
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                  : 'border-slate-700 hover:border-emerald-500/50 bg-slate-950/50 hover:bg-slate-950/80'
              }`}
            >
              {compressing ? (
                <div className="py-2 space-y-2">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-white">Compressing & Uploading Photos...</p>
                  <p className="text-[11px] text-slate-400">
                    High-res photos ko instant fast-loading WebP me compress kiya ja raha hai
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Click to Select Photos from Mobile/PC
                    </span>
                    <span className="text-xs text-slate-400"> or drag and drop here</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports 10MB+ phone camera pictures (Auto compressed down to ~150KB for ultra-fast loading!)
                  </p>
                </div>
              )}
            </div>

            {/* Compression Feedback Badge */}
            {compressionStats && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Successfully compressed {compressionStats.count} photo(s):{' '}
                    <strong className="text-white">
                      {formatFileSize(compressionStats.originalSize)}
                    </strong>{' '}
                    ➔{' '}
                    <strong className="text-emerald-300">
                      {formatFileSize(compressionStats.compressedSize)}
                    </strong>
                  </span>
                </div>
                <span className="font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                  {compressionStats.reduction}% Smaller!
                </span>
              </div>
            )}

            {/* Current thumbnails */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Photo Gallery ({images.length} photos)</span>
                  <span className="text-[10px] text-slate-500">First photo is used as Cover Photo</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group aspect-square rounded-xl overflow-hidden border bg-slate-950 ${
                        idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-700'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="preview" className="w-full h-full object-cover" />

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            className="p-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors"
                            title="Set as Cover Photo"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500 text-white shadow-md">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual URL fallback */}
            <div className="pt-2 border-t border-white/[0.05] space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="Or paste external image URL (https://...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                  + Add URL
                </button>
              </div>

              {/* Sample Photos Quick Pick */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>Sample photos:</span>
                <button
                  type="button"
                  onClick={() => setImages([...images, SAMPLE_IMAGES[0]])}
                  className="hover:text-emerald-400 underline"
                >
                  + iPhone
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setImages([...images, SAMPLE_IMAGES[1]])}
                  className="hover:text-emerald-400 underline"
                >
                  + Samsung
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setImages([...images, SAMPLE_IMAGES[2]])}
                  className="hover:text-emerald-400 underline"
                >
                  + OnePlus
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Included Accessories */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              5. Included Accessories (साथ में क्या-क्या मिलेगा)
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_ACCESSORIES.map((acc) => {
                const active = includes.includes(acc);
                return (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => handleToggleAccessory(acc)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>{acc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom accessory input */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add other item (e.g. 67W Charger, Invoice Copy)"
                value={customAccessory}
                onChange={(e) => setCustomAccessory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAccessory();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomAccessory}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Section 6: Description */}
          <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              6. Description & Notes (विवरण / खासियत)
            </h3>
            <textarea
              rows={3}
              placeholder="e.g. 100% genuine display, zero scratches, always used with back cover, Apple warranty active till Nov..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-white/[0.08] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving || compressing}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || compressing}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes (अपडेट करें)' : 'Add Mobile (स्टॉक में जोड़ें)'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
