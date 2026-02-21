"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Tag, X, Plus, Clock, Loader2, Building2, Globe } from 'lucide-react';
import { getAllProperties } from '@/lib/services/property.service';

/* ──────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
export interface SuggestionItem {
    type: 'keyword' | 'property' | 'regency' | 'province';
    label: string;
    sublabel?: string;
    category?: string;
    filterParams: {
        keyword?: string;
        regency?: string;
        province?: string;
    };
}

interface LocationData {
    regencies: { name: string; province: string }[];
    provinces: string[];
}

interface SearchAutocompleteProps {
    onSearch?: (query: string, filterParams: SuggestionItem['filterParams']) => void;
    placeholder?: string;
    className?: string;
}

/* ──────────────────────────────────────────────────────────
   Highlight helper
────────────────────────────────────────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} className="bg-transparent text-[hsl(207,23%,28%)] font-semibold">{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </>
    );
}

/* ──────────────────────────────────────────────────────────
   Deduplicate by key
────────────────────────────────────────────────────────── */
function dedupBy<T>(arr: T[], key: (item: T) => string): T[] {
    const seen = new Set<string>();
    return arr.filter(item => {
        const k = key(item).toLowerCase().trim();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}

/* ──────────────────────────────────────────────────────────
   Normalize string untuk fuzzy match
   "jakarta selatan" → "jakarta selatan"
   "DKI Jakarta"    → "dki jakarta"
────────────────────────────────────────────────────────── */
function normalize(s: string) {
    return s.toLowerCase().trim();
}

/* ──────────────────────────────────────────────────────────
   Main component
────────────────────────────────────────────────────────── */
export default function SearchAutocomplete({
    onSearch,
    placeholder = 'Cari properti, kota, atau provinsi...',
    className = '',
}: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<{ label: string; filterParams: SuggestionItem['filterParams'] }[]>([]);

    // Daftar lokasi unik dari DB — di-fetch sekali saat mount
    const [locationData, setLocationData] = useState<LocationData>({ regencies: [], provinces: [] });
    const [locationLoaded, setLocationLoaded] = useState(false);

    // Suggestions yang ditampilkan
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [loadingProps, setLoadingProps] = useState(false); // loading untuk property suggestions

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    /* ── Load recent searches ── */
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('prop_recent_v3') || '[]');
            setRecentSearches(stored.slice(0, 3));
        } catch { }
    }, []);

    /* ── Close on outside click ── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* ──────────────────────────────────────────────────────
       STEP 1: Fetch semua lokasi unik dari DB saat mount.
       Fetch dengan limit besar → extract unique regency & province.
       Ini hanya dilakukan SEKALI, hasilnya disimpan di state.
    ────────────────────────────────────────────────────── */
    useEffect(() => {
        async function loadLocations() {
            try {
                // Fetch page 1 s/d beberapa page untuk dapat data lokasi yang variatif
                // Kalau properti < 200, 1 request sudah cukup
                const res = await getAllProperties({ limit: 200, page: 1 });
                const data: any[] = res.data?.property || res.data || [];

                const rawRegencies = data
                    .filter(item => item.regency)
                    .map(item => ({ name: item.regency as string, province: item.province || '' }));

                const rawProvinces = data
                    .filter(item => item.province)
                    .map(item => item.province as string);

                const regencies = dedupBy(rawRegencies, r => r.name);
                const provinces = [...new Set(rawProvinces.map(p => p.trim()).filter(Boolean))];

                setLocationData({ regencies, provinces });
            } catch (err) {
                console.error('Failed to load location data:', err);
            } finally {
                setLocationLoaded(true);
            }
        }
        loadLocations();
    }, []);

    /* ──────────────────────────────────────────────────────
       STEP 2: Saat user mengetik, build suggestions:
       - Filter regency/province dari locationData (client-side, instant)
       - Fetch properti by keyword (debounced, untuk suggestions nama)
    ────────────────────────────────────────────────────── */
    const buildSuggestions = useCallback(async (q: string) => {
        const items: SuggestionItem[] = [];
        const norm = normalize(q);

        if (!q.trim()) {
            // Kosong → tampilkan top 5 regency populer + 5 properti terbaru
            const topRegencies = locationData.regencies.slice(0, 5);
            topRegencies.forEach(r => {
                items.push({
                    type: 'regency',
                    label: r.name,
                    sublabel: r.province,
                    category: 'Kota / Kab',
                    filterParams: { regency: r.name },
                });
            });

            // Properti terbaru
            try {
                setLoadingProps(true);
                const res = await getAllProperties({ limit: 4, page: 1 });
                const data: any[] = res.data?.property || res.data || [];
                data.forEach((item: any) => {
                    items.push({
                        type: 'property',
                        label: item.title,
                        sublabel: [item.district, item.regency].filter(Boolean).join(', '),
                        category: 'Properti',
                        filterParams: { keyword: item.title },
                    });
                });
            } catch { } finally {
                setLoadingProps(false);
            }

            setSuggestions(items);
            return;
        }

        // ── Ada query ──

        // 1. Keyword suggestion
        items.push({
            type: 'keyword',
            label: q.trim(),
            category: 'Kata Kunci',
            filterParams: { keyword: q.trim() },
        });

        // 2. Filter regency dari locationData — EXACT contains match pada nama kota
        const matchedRegencies = locationData.regencies
            .filter(r => normalize(r.name).includes(norm))
            .slice(0, 4);

        matchedRegencies.forEach(r => {
            items.push({
                type: 'regency',
                label: r.name,
                sublabel: r.province,
                category: 'Kota / Kab',
                filterParams: { regency: r.name }, // ← exact value dari DB
            });
        });

        // 3. Filter province dari locationData
        const matchedProvinces = locationData.provinces
            .filter(p => normalize(p).includes(norm))
            .slice(0, 2);

        matchedProvinces.forEach(p => {
            items.push({
                type: 'province',
                label: p,
                sublabel: 'Provinsi',
                category: 'Provinsi',
                filterParams: { province: p }, // ← exact value dari DB
            });
        });

        // 4. Fetch properti by keyword (nama properti)
        try {
            setLoadingProps(true);
            const res = await getAllProperties({ keyword: q.trim(), limit: 4, page: 1 });
            const data: any[] = res.data?.property || res.data || [];
            data.forEach((item: any) => {
                items.push({
                    type: 'property',
                    label: item.title,
                    sublabel: [item.district, item.regency].filter(Boolean).join(', '),
                    category: 'Properti',
                    filterParams: { keyword: item.title },
                });
            });
        } catch { } finally {
            setLoadingProps(false);
        }

        setSuggestions(items);
    }, [locationData]);

    /* Debounce build suggestions */
    useEffect(() => {
        if (!open) return;
        clearTimeout(debounceRef.current);
        const delay = query.trim() ? 300 : 0;
        debounceRef.current = setTimeout(() => buildSuggestions(query), delay);
        return () => clearTimeout(debounceRef.current);
    }, [query, open, buildSuggestions]);

    /* ── Group suggestions ── */
    const keywordItems = suggestions.filter(s => s.type === 'keyword');
    const locationItems = suggestions.filter(s => s.type === 'regency' || s.type === 'province');
    const propertyItems = suggestions.filter(s => s.type === 'property');

    const showRecent = query.trim() === '' && recentSearches.length > 0;

    const flatList = [
        ...(showRecent ? recentSearches : []),
        ...keywordItems,
        ...locationItems,
        ...propertyItems,
    ];

    function saveRecent(label: string, filterParams: SuggestionItem['filterParams']) {
        if (!label.trim()) return;
        const next = [{ label, filterParams }, ...recentSearches.filter(r => r.label !== label)].slice(0, 5);
        setRecentSearches(next);
        try { localStorage.setItem('prop_recent_v3', JSON.stringify(next)); } catch { }
    }

    function commitSearch(label: string, filterParams: SuggestionItem['filterParams']) {
        saveRecent(label, filterParams);
        setOpen(false);
        setActiveIndex(-1);
        onSearch?.(label, filterParams);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setOpen(true);
        setActiveIndex(-1);
    }

    function handleOpen() {
        setOpen(true);
        if (suggestions.length === 0) buildSuggestions(query);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) { if (e.key === 'ArrowDown') handleOpen(); return; }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(i => Math.min(i + 1, flatList.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(i => Math.max(i - 1, -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && flatList[activeIndex]) {
                    const item = flatList[activeIndex] as any;
                    setQuery(item.label);
                    commitSearch(item.label, item.filterParams || { keyword: item.label });
                } else {
                    commitSearch(query, { keyword: query });
                }
                break;
            case 'Escape':
                setOpen(false);
                setActiveIndex(-1);
                inputRef.current?.blur();
                break;
        }
    }

    function handleSuggestionClick(item: { label: string; filterParams: SuggestionItem['filterParams'] }) {
        setQuery(item.label);
        commitSearch(item.label, item.filterParams);
    }

    function clearQuery() {
        setQuery('');
        setSuggestions([]);
        setOpen(true);
        inputRef.current?.focus();
    }

    /* ── Icon per type ── */
    function SuggestionIcon({ type }: { type: SuggestionItem['type'] }) {
        if (type === 'keyword') return (
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 text-gray-500" />
            </div>
        );
        if (type === 'property') return (
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-blue-500" />
            </div>
        );
        if (type === 'province') return (
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-green-600" />
            </div>
        );
        // regency
        return (
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[hsl(0,63%,43%)]" />
            </div>
        );
    }

    /* ── Suggestion group renderer ── */
    function SuggestionGroup({
        title,
        items,
        startIdx,
    }: {
        title: string;
        items: SuggestionItem[];
        startIdx: number;
    }) {
        if (items.length === 0) return null;
        return (
            <div className="px-4 pb-1">
                <p className="text-xs font-semibold text-[hsl(0,63%,43%)] uppercase tracking-wider mb-1 mt-3">
                    {title}
                </p>
                {items.map((item, i) => {
                    const flatIdx = startIdx + i;
                    return (
                        <button
                            key={`${item.type}-${i}`}
                            onMouseDown={e => { e.preventDefault(); handleSuggestionClick(item); }}
                            className={`
                                w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left group
                                transition-colors duration-100
                                ${activeIndex === flatIdx ? 'bg-gray-100' : 'hover:bg-gray-50'}
                            `}
                            role="option"
                            aria-selected={activeIndex === flatIdx}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <SuggestionIcon type={item.type} />
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-800 truncate">
                                        <Highlight text={item.label} query={query} />
                                    </p>
                                    {item.sublabel && (
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.sublabel}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {item.category}
                                </span>
                                <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-3 h-3 text-gray-500" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    const recentOffset = 0;
    const keywordOffset = showRecent ? recentSearches.length : 0;
    const locationOffset = keywordOffset + keywordItems.length;
    const propertyOffset = locationOffset + locationItems.length;

    const isLoading = !locationLoaded || loadingProps;

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            {/* ── Input row ── */}
            <div className={`
                flex items-center bg-white rounded-2xl overflow-hidden
                shadow-[0_2px_20px_rgba(0,0,0,0.10)]
                border-2 transition-all duration-200
                ${open
                    ? 'border-[hsl(207,23%,28%)] shadow-[0_4px_24px_rgba(35,51,66,0.18)]'
                    : 'border-transparent'
                }
            `}>
                <div className="pl-5 pr-3 flex items-center shrink-0">
                    <Search className={`w-5 h-5 transition-colors duration-200 ${open ? 'text-[hsl(0,63%,43%)]' : 'text-gray-400'}`} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleOpen}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 h-14 text-base bg-transparent outline-none text-gray-800 placeholder:text-gray-400 min-w-0"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={open}
                    role="combobox"
                />

                {(isLoading && open) && (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin mr-2 shrink-0" />
                )}

                {query && !(isLoading && open) && (
                    <button
                        onMouseDown={e => { e.preventDefault(); clearQuery(); }}
                        className="p-2 mr-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}

                <button
                    onMouseDown={e => { e.preventDefault(); commitSearch(query, { keyword: query }); }}
                    className="h-14 px-6 bg-[hsl(207,23%,28%)] hover:bg-[hsl(207,23%,22%)] active:scale-95 text-white font-semibold text-sm transition-all duration-200 shrink-0 flex items-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Cari
                </button>
            </div>

            {/* ── Dropdown ── */}
            {open && (
                <div
                    className="
                        absolute left-0 right-0 top-[calc(100%+8px)] z-50
                        bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)]
                        border border-gray-100 overflow-hidden
                        animate-in fade-in slide-in-from-top-2 duration-200
                        max-h-[500px] overflow-y-auto
                    "
                    role="listbox"
                >
                    {/* Recent searches */}
                    {showRecent && (
                        <div className="px-4 pt-4 pb-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Pencarian Terbaru
                            </p>
                            {recentSearches.map((r, i) => (
                                <button
                                    key={r.label}
                                    onMouseDown={e => { e.preventDefault(); handleSuggestionClick(r); }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                                        transition-colors duration-100
                                        ${activeIndex === (recentOffset + i) ? 'bg-gray-100' : 'hover:bg-gray-50'}
                                    `}
                                    role="option"
                                    aria-selected={activeIndex === (recentOffset + i)}
                                >
                                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-sm text-gray-700">{r.label}</span>
                                </button>
                            ))}
                            {suggestions.length > 0 && <div className="border-t border-gray-100 mt-2" />}
                        </div>
                    )}

                    {/* Loading — hanya saat location belum loaded */}
                    {!locationLoaded && (
                        <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Memuat data lokasi...</span>
                        </div>
                    )}

                    {/* Suggestions */}
                    {locationLoaded && (
                        <>
                            <SuggestionGroup title="Kata Kunci" items={keywordItems} startIdx={keywordOffset} />
                            <SuggestionGroup title="Lokasi" items={locationItems} startIdx={locationOffset} />
                            <SuggestionGroup title="Properti" items={propertyItems} startIdx={propertyOffset} />
                        </>
                    )}

                    {/* Empty state */}
                    {locationLoaded && suggestions.length === 0 && query.trim() !== '' && (
                        <div className="px-4 py-8 text-center">
                            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Tidak ada hasil untuk "<strong>{query}</strong>"</p>
                            <p className="text-xs text-gray-400 mt-1">Tekan Enter untuk mencari langsung</p>
                        </div>
                    )}

                    <div className="h-2" />
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
   Cara pakai di Properties.tsx — sama seperti sebelumnya:

   <SearchAutocomplete
     onSearch={(label, filterParams) => {
       setSearchQuery('');
       setDebouncedSearch('');
       setLocationFilter('all');
       setProvinceFilter('all');

       if (filterParams.keyword)  setSearchQuery(filterParams.keyword);
       if (filterParams.regency)  setLocationFilter(filterParams.regency);   // exact dari DB
       if (filterParams.province) setProvinceFilter(filterParams.province);  // exact dari DB

       setCurrentPage(1);
     }}
   />
────────────────────────────────────────────────────────── */