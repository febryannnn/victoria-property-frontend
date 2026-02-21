"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Tag, X, Plus, Clock, Loader2, Building2, Globe } from 'lucide-react';
import { getAllProperties } from '@/lib/services/property.service';

/* ──────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
export interface SuggestionItem {
    type: 'keyword' | 'property' | 'regency' | 'province' | 'district';
    label: string;
    sublabel?: string;
    category?: string;
    filterParams: {
        keyword?: string;
        regency?: string;
        province?: string;
        district?: string;
    };
}

interface LocationData {
    regencies: { name: string; province: string }[];
    provinces: string[];
    districts: { name: string; regency: string; province: string }[];
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
    const [appliedFilter, setAppliedFilter] = useState<{
        label: string;
        filterParams: SuggestionItem['filterParams'];
    } | null>(null);
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<{ label: string; filterParams: SuggestionItem['filterParams'] }[]>([]);

    const [locationData, setLocationData] = useState<LocationData>({
        regencies: [],
        provinces: [],
        districts: [],
    });
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [loadingProps, setLoadingProps] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    /* ── Fetch location data once ── */
    useEffect(() => {
        async function loadLocations() {
            try {
                const res = await getAllProperties({ limit: 200, page: 1 });
                const data: any[] = Array.isArray(res.data) ? res.data : [];

                const rawRegencies = data
                    .filter(item => item.regency)
                    .map(item => ({ name: item.regency as string, province: item.province || '' }));

                const rawProvinces = data
                    .filter(item => item.province)
                    .map(item => item.province as string);

                const rawDistricts = data
                    .filter(item => item.district)
                    .map(item => ({
                        name: item.district as string,
                        regency: item.regency || '',
                        province: item.province || '',
                    }));

                const districts = dedupBy(rawDistricts, d => d.name);
                const regencies = dedupBy(rawRegencies, r => r.name);
                const provinces = [...new Set(rawProvinces.map(p => p.trim()).filter(Boolean))];

                setLocationData({ regencies, provinces, districts });
            } catch (err) {
                console.error('Failed to load location data:', err);
            } finally {
                setLocationLoaded(true);
            }
        }
        loadLocations();
    }, []);

    /* ── Build suggestions ── */
    const buildSuggestions = useCallback(async (q: string) => {
        const items: SuggestionItem[] = [];
        const norm = normalize(q);

        if (!q.trim()) {
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

            try {
                setLoadingProps(true);
                const res = await getAllProperties({ limit: 4, page: 1 });
                const data: any[] = Array.isArray(res.data) ? res.data : [];
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

        items.push({
            type: 'keyword',
            label: q.trim(),
            category: 'Kata Kunci',
            filterParams: { keyword: q.trim() },
        });

        const matchedRegencies = locationData.regencies
            .filter(r => normalize(r.name).includes(norm))
            .slice(0, 4);

        matchedRegencies.forEach(r => {
            items.push({
                type: 'regency',
                label: r.name,
                sublabel: r.province,
                category: 'Kota / Kab',
                filterParams: { regency: r.name },
            });
        });

        const matchedProvinces = locationData.provinces
            .filter(p => normalize(p).includes(norm))
            .slice(0, 2);

        matchedProvinces.forEach(p => {
            items.push({
                type: 'province',
                label: p,
                sublabel: 'Provinsi',
                category: 'Provinsi',
                filterParams: { province: p },
            });
        });

        const matchedDistricts = locationData.districts
            .filter(d => normalize(d.name).includes(norm))
            .slice(0, 4);

        matchedDistricts.forEach(d => {
            items.push({
                type: 'district',
                label: d.name,
                sublabel: [d.regency, d.province].filter(Boolean).join(', '),
                category: 'Kecamatan',
                filterParams: { district: d.name },
            });
        });

        try {
            setLoadingProps(true);
            const res = await getAllProperties({ keyword: q.trim(), limit: 4, page: 1 });
            const data: any[] = Array.isArray(res.data) ? res.data : [];
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const delay = query.trim() ? 300 : 0;
        debounceRef.current = setTimeout(() => buildSuggestions(query), delay);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, open, buildSuggestions]);

    /* ── Group suggestions ── */
    const keywordItems = suggestions.filter(s => s.type === 'keyword');
    const locationItems = suggestions.filter(s => s.type === 'regency' || s.type === 'province' || s.type === 'district');
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
        setAppliedFilter({ label, filterParams });
        setQuery('');
        setOpen(false);
        setActiveIndex(-1);
        onSearch?.(label, filterParams);
    }

    function clearAppliedFilter() {
        setAppliedFilter(null);
        onSearch?.('', {});
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
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            </div>
        );
        if (type === 'property') return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
            </div>
        );
        if (type === 'province') return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
        );
        if (type === 'district') return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
        );
        return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(0,63%,43%)]" />
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
            <div className="px-2 sm:px-4 pb-1">
                <p className="text-[10px] sm:text-xs font-semibold text-[hsl(0,63%,43%)] uppercase tracking-wider mb-1 mt-3 px-1">
                    {title}
                </p>
                {items.map((item, i) => {
                    const flatIdx = startIdx + i;
                    return (
                        <button
                            key={`${item.type}-${i}`}
                            onMouseDown={e => { e.preventDefault(); handleSuggestionClick(item); }}
                            className={`
                                w-full flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-left group
                                transition-colors duration-100
                                ${activeIndex === flatIdx ? 'bg-gray-100' : 'hover:bg-gray-50'}
                            `}
                            role="option"
                            aria-selected={activeIndex === flatIdx}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <SuggestionIcon type={item.type} />
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-gray-800 truncate">
                                        <Highlight text={item.label} query={query} />
                                    </p>
                                    {item.sublabel && (
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">{item.sublabel}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                {/* Hide category badge on very small screens */}
                                <span className="hidden xs:inline-block text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {item.category}
                                </span>
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500" />
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
                flex items-center bg-white rounded-xl sm:rounded-2xl overflow-hidden
                shadow-[0_2px_20px_rgba(0,0,0,0.10)]
                border-2 transition-all duration-200
                ${open
                    ? 'border-[hsl(207,23%,28%)] shadow-[0_4px_24px_rgba(35,51,66,0.18)]'
                    : 'border-transparent'
                }
            `}>
                {/* Search icon — hidden on very small screens to save space */}
                <div className="hidden sm:flex pl-4 sm:pl-5 pr-2 sm:pr-3 items-center shrink-0">
                    <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${open ? 'text-[hsl(0,63%,43%)]' : 'text-gray-400'}`} />
                </div>

                {appliedFilter ? (
                    <div className="flex items-center flex-1 h-10 sm:h-14 px-2 sm:px-3 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-100 text-blue-700 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium max-w-full overflow-hidden">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-[200px]">
                                {appliedFilter.label}
                            </span>
                            <button
                                onClick={clearAppliedFilter}
                                className="ml-0.5 sm:ml-1 hover:bg-blue-200 rounded-full p-0.5 sm:p-1 transition shrink-0"
                            >
                                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleOpen}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 h-10 sm:h-14 text-sm sm:text-base bg-transparent outline-none text-gray-800 placeholder:text-gray-400 min-w-0 px-2 sm:px-0"
                        autoComplete="off"
                    />
                )}

                {(isLoading && open) && (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 animate-spin mr-1.5 sm:mr-2 shrink-0" />
                )}

                {query && !(isLoading && open) && (
                    <button
                        onMouseDown={e => { e.preventDefault(); clearQuery(); }}
                        className="p-1.5 sm:p-2 mr-0.5 sm:mr-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                )}

                {/* Search button — icon only on mobile, icon+text on desktop */}
                <button
                    onMouseDown={e => { e.preventDefault(); commitSearch(query, { keyword: query }); }}
                    className="h-10 sm:h-14 px-3 sm:px-6 bg-[hsl(207,23%,28%)] hover:bg-[hsl(207,23%,22%)] active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shrink-0 flex items-center gap-1.5 sm:gap-2"
                >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Cari</span>
                </button>
            </div>

            {/* ── Dropdown ── */}
            {open && (
                <div
                    className="
                        absolute left-0 right-0 top-[calc(100%+6px)] sm:top-[calc(100%+8px)] z-50
                        bg-white rounded-xl sm:rounded-2xl
                        shadow-[0_8px_40px_rgba(0,0,0,0.14)]
                        border border-gray-100 overflow-hidden
                        animate-in fade-in slide-in-from-top-2 duration-200
                        max-h-[60vh] sm:max-h-[500px] overflow-y-auto
                    "
                    role="listbox"
                >
                    {/* Recent searches */}
                    {showRecent && (
                        <div className="px-2 sm:px-4 pt-3 sm:pt-4 pb-1">
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                Pencarian Terbaru
                            </p>
                            {recentSearches.map((r, i) => (
                                <button
                                    key={r.label}
                                    onMouseDown={e => { e.preventDefault(); handleSuggestionClick(r); }}
                                    className={`
                                        w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-left
                                        transition-colors duration-100
                                        ${activeIndex === (recentOffset + i) ? 'bg-gray-100' : 'hover:bg-gray-50'}
                                    `}
                                    role="option"
                                    aria-selected={activeIndex === (recentOffset + i)}
                                >
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                                    <span className="text-xs sm:text-sm text-gray-700 truncate">{r.label}</span>
                                </button>
                            ))}
                            {suggestions.length > 0 && <div className="border-t border-gray-100 mt-2" />}
                        </div>
                    )}

                    {/* Loading */}
                    {!locationLoaded && (
                        <div className="flex items-center justify-center gap-2 py-5 sm:py-6 text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs sm:text-sm">Memuat data lokasi...</span>
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
                        <div className="px-4 py-6 sm:py-8 text-center">
                            <Search className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">
                                Tidak ada hasil untuk "<strong>{query}</strong>"
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Tekan Enter untuk mencari langsung</p>
                        </div>
                    )}

                    <div className="h-1.5 sm:h-2" />
                </div>
            )}
        </div>
    );
}