"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import ListingCard, { ListingData } from "@/components/ListingCard";
import { fetchAllListings, fetchAllResaleListings } from "@/lib/solana";

// Helper to parse metadata URI (supports old and new formats)
function parseMetadata(uri: string): { source: string; work: string; description?: string; imageUrl?: string } {
  // New format: data:application/json;base64,...
  if (uri.startsWith('data:application/json;base64,')) {
    try {
      const base64 = uri.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
      return {
        source: json.source || 'other',
        work: json.work || 'Unknown',
        description: json.description,
        imageUrl: json.imageUrl,
      };
    } catch {
      return { source: 'other', work: uri };
    }
  }
  
  // Old format: ipfs://source/work
  if (uri.startsWith('ipfs://')) {
    const parts = uri.replace('ipfs://', '').split('/');
    return {
      source: parts[0] || 'other',
      work: parts.slice(1).join('/') || 'Unknown',
    };
  }
  
  return { source: 'other', work: uri };
}

// Revenue source display names
const sourceLabels: Record<string, string> = {
  youtube: "YouTube AdSense",
  spotify: "Spotify Streaming",
  twitch: "Twitch Subscriptions",
  patreon: "Patreon Memberships",
  steam: "Steam Game Sales",
  amazon: "Amazon KDP",
  substack: "Substack Newsletter",
  podcast: "Podcast Sponsorships",
  other: "Other",
};

// Secondary market listings (resales)
const secondaryListings: ListingData[] = [
  {
    id: "s1",
    creatorName: "Alex Rivera",
    revenueSource: "YouTube AdSense - Tech Reviews",
    percentageOffered: 1,
    duration: "18 months remaining",
    price: 650,
    isSecondary: true,
    currentOwner: "8xH3...k9Pm",
  },
  {
    id: "s2",
    creatorName: "Maya Chen",
    revenueSource: "Spotify Streaming - Electronic Music",
    percentageOffered: 2,
    duration: "30 months remaining",
    price: 1800,
    isSecondary: true,
    currentOwner: "4rKm...Xt7n",
  },
  {
    id: "s3",
    creatorName: "Jordan Blake",
    revenueSource: "Twitch Subscriptions",
    percentageOffered: 4,
    duration: "8 months remaining",
    price: 1900,
    isSecondary: true,
    currentOwner: "9pLq...Wz2a",
  },
  {
    id: "s4",
    creatorName: "Taylor Reed",
    revenueSource: "Indie Game Sales - Steam",
    percentageOffered: 0.5,
    duration: "Perpetual",
    price: 3500,
    isSecondary: true,
    currentOwner: "2bNr...Hy6c",
  },
  {
    id: "s5",
    creatorName: "Sam Foster",
    revenueSource: "Patreon Memberships - Art Community",
    percentageOffered: 5,
    duration: "12 months remaining",
    price: 2100,
    isSecondary: true,
    currentOwner: "7vCx...Jm4k",
  },
  {
    id: "s6",
    creatorName: "Riley Hayes",
    revenueSource: "Newsletter Subscriptions - Substack",
    percentageOffered: 3.5,
    duration: "20 months remaining",
    price: 2800,
    isSecondary: true,
    currentOwner: "1zQw...Tf9s",
  },
];

// Primary market listings (new from creators)
const primaryListings: ListingData[] = [
  {
    id: "p1",
    creatorName: "Alex Rivera",
    revenueSource: "YouTube AdSense - Tech Reviews",
    percentageOffered: 5,
    duration: "24 months",
    price: 2500,
  },
  {
    id: "p2",
    creatorName: "Maya Chen",
    revenueSource: "Spotify Streaming - Electronic Music",
    percentageOffered: 10,
    duration: "36 months",
    price: 8000,
  },
  {
    id: "p3",
    creatorName: "Jordan Blake",
    revenueSource: "Twitch Subscriptions",
    percentageOffered: 8,
    duration: "12 months",
    price: 4500,
  },
  {
    id: "p4",
    creatorName: "Sam Foster",
    revenueSource: "Patreon Memberships - Art Community",
    percentageOffered: 15,
    duration: "18 months",
    price: 6000,
  },
  {
    id: "p5",
    creatorName: "Taylor Reed",
    revenueSource: "Indie Game Sales - Steam",
    percentageOffered: 3,
    duration: "Perpetual",
    price: 15000,
  },
  {
    id: "p6",
    creatorName: "Casey Morgan",
    revenueSource: "eBook Royalties - Amazon KDP",
    percentageOffered: 12,
    duration: "48 months",
    price: 3200,
  },
];

type MarketType = "secondary" | "primary";
type SortOption = "newest" | "price-low" | "price-high" | "percentage";

export default function MarketplacePage() {
  const [marketType, setMarketType] = useState<MarketType>("primary");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isLoading, setIsLoading] = useState(true);
  const [onChainPrimaryListings, setOnChainPrimaryListings] = useState<ListingData[]>([]);
  const [onChainSecondaryListings, setOnChainSecondaryListings] = useState<ListingData[]>([]);

  // Fetch listings from blockchain on mount
  useEffect(() => {
    async function loadListings() {
      setIsLoading(true);
      try {
        // Fetch primary listings (royalty listings)
        const primaryData = await fetchAllListings();
        const formattedPrimary: ListingData[] = primaryData
          .filter(l => l.status === 'Active')
          // Only show listings with new metadata format (has images/descriptions)
          .filter(l => l.metadataUri?.startsWith('data:application/json;base64,'))
          .map(l => {
            const metadata = parseMetadata(l.metadataUri || '');
            return {
              id: l.publicKey,
              creatorName: `${l.creator.slice(0, 4)}...${l.creator.slice(-4)}`,
              creatorAddress: l.creator,
              revenueSource: metadata.work !== 'Unknown' 
                ? `${sourceLabels[metadata.source] || metadata.source} - ${metadata.work}`
                : sourceLabels[metadata.source] || 'On-chain Listing',
              percentageOffered: l.percentage,
              duration: l.durationSeconds === 0 ? "Perpetual" : `${Math.floor(l.durationSeconds / (30 * 24 * 60 * 60))} months`,
              durationSeconds: l.durationSeconds,
              startTimestamp: l.startTimestamp,
              price: l.priceUsdc,
              imageUrl: metadata.imageUrl,
              description: metadata.description,
              platformIcon: metadata.source,
            };
          });
        
        // Fetch secondary listings (resales)
        const secondaryData = await fetchAllResaleListings();
        const formattedSecondary: ListingData[] = secondaryData.map(l => ({
          id: l.publicKey,
          creatorName: "Resale Listing",
          revenueSource: "Secondary Market",
          percentageOffered: 0,
          duration: "See Details",
          price: l.priceUsdc,
          isSecondary: true,
          currentOwner: `${l.seller.slice(0, 4)}...${l.seller.slice(-4)}`,
        }));

        setOnChainPrimaryListings(formattedPrimary);
        setOnChainSecondaryListings(formattedSecondary);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadListings();
  }, []);

  // Raw listings based on market type
  const rawListings = marketType === "secondary" 
    ? (onChainSecondaryListings.length > 0 ? onChainSecondaryListings : secondaryListings)
    : (onChainPrimaryListings.length > 0 ? onChainPrimaryListings : primaryListings);

  // Filtered and sorted listings
  const listings = useMemo(() => {
    let result = [...rawListings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.creatorName.toLowerCase().includes(query) ||
        l.revenueSource.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query)
      );
    }

    // Platform filter
    if (filter !== "all") {
      result = result.filter(l => 
        l.revenueSource.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(l => 
      l.price >= priceRange[0] && l.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "percentage":
        result.sort((a, b) => b.percentageOffered - a.percentageOffered);
        break;
      case "newest":
      default:
        // Keep original order (newest first from chain)
        break;
    }

    return result;
  }, [rawListings, searchQuery, filter, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <SectionHeader
            title="Marketplace"
            subtitle="Browse and invest in creator royalties. Trade tokens on the secondary market or buy directly from creators."
          />

          {/* Market Type Toggle */}
          <div className="flex gap-0 mt-8 border border-black inline-flex">
            <button
              onClick={() => setMarketType("secondary")}
              className={`px-8 py-3 font-medium text-sm transition-colors ${
                marketType === "secondary"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Secondary Market
              <span className="ml-2 text-xs opacity-60">RESALES</span>
            </button>
            <button
              onClick={() => setMarketType("primary")}
              className={`px-8 py-3 font-medium text-sm transition-colors border-l border-black ${
                marketType === "primary"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Primary Market
              <span className="ml-2 text-xs opacity-60">NEW</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {marketType === "secondary" ? (
              <>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">24h Volume</p>
                  <p className="text-2xl font-bold">$48,350</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Active Listings</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Floor Price</p>
                  <p className="text-2xl font-bold">$180</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Total Traded</p>
                  <p className="text-2xl font-bold">$1.8M</p>
                </div>
              </>
            ) : (
              <>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Total Raised</p>
                  <p className="text-2xl font-bold">$2.4M</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Active Listings</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Avg. Raise</p>
                  <p className="text-2xl font-bold">$5,800</p>
                </div>
                <div className="border border-black p-4">
                  <p className="text-sm text-black/60">Creators</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </>
            )}
          </div>

          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by creator, platform, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-black bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black min-w-[180px]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="percentage">Highest Percentage</option>
            </select>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={priceRange[0] || ''}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                className="w-24 px-3 py-3 border border-black bg-white text-black placeholder:text-black/40 focus:outline-none"
              />
              <span className="text-black/40">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={priceRange[1] === 100000 ? '' : priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
                className="w-24 px-3 py-3 border border-black bg-white text-black placeholder:text-black/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { key: "all", label: "All", icon: "★" },
              { key: "youtube", label: "YouTube", icon: "▶" },
              { key: "spotify", label: "Spotify", icon: "♪" },
              { key: "twitch", label: "Twitch", icon: "◉" },
              { key: "patreon", label: "Patreon", icon: "P" },
              { key: "steam", label: "Steam", icon: "⬢" },
              { key: "substack", label: "Substack", icon: "S" },
              { key: "other", label: "Other", icon: "…" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === f.key
                    ? "bg-black text-white"
                    : "border border-black/30 text-black/60 hover:border-black hover:text-black"
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-black/60">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Loading...
                </div>
              )}
              
              {/* On-chain indicator */}
              {!isLoading && (onChainPrimaryListings.length > 0 || onChainSecondaryListings.length > 0) && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live on-chain
                </div>
              )}
            </div>

            {/* Results count */}
            {!isLoading && (
              <p className="text-sm text-black/60">
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
                {(searchQuery || filter !== 'all' || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                      setPriceRange([0, 100000]);
                    }}
                    className="ml-2 text-black underline hover:no-underline"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {listings.length > 0 ? (
              <motion.div
                key={`${marketType}-${filter}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center border border-dashed border-black/20"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No listings found</h3>
                <p className="text-black/60 mb-4">
                  {searchQuery 
                    ? `No results for "${searchQuery}"`
                    : "Try adjusting your filters"
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                    setPriceRange([0, 100000]);
                  }}
                  className="px-6 py-2 border border-black font-medium hover:bg-black hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more */}
          {listings.length >= 8 && (
            <div className="mt-12 text-center">
              <button className="px-8 py-4 border-2 border-black font-medium hover:bg-black hover:text-white transition-colors">
                Load More Listings
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {marketType === "secondary" ? "Have tokens to sell?" : "Want to raise capital?"}
              </h3>
              <p className="text-white/60">
                {marketType === "secondary"
                  ? "List your royalty tokens on the secondary market."
                  : "Tokenize your future revenue and sell royalties."}
              </p>
            </div>
            <Link
              href="/sell"
              className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              {marketType === "secondary" ? "List Tokens" : "Sell Royalties"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
