/**
 * API client for fetching cached listing data
 * Uses server-side caching to reduce RPC calls
 */

export interface ListingFromAPI {
  pubkey: string;
  creator: string;
  nftMint: string;
  metadataUri: string;
  price: string;
  percentageBps: number;
  durationSeconds: string;
  createdAt: string;
  resaleAllowed: boolean;
  resaleRoyaltyBps: number;
  status: string;
}

export interface ResaleListingFromAPI {
  pubkey: string;
  seller: string;
  originalListing: string;
  nftMint: string;
  price: string;
  createdAt: string;
  isActive: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  cached?: boolean;
  timestamp?: number;
  error?: string;
  message?: string;
}

/**
 * Fetch all primary listings from the cached API
 */
export async function fetchListingsFromAPI(): Promise<ListingFromAPI[]> {
  try {
    const response = await fetch('/api/listings');
    const result: APIResponse<ListingFromAPI[]> = await response.json();
    
    if (!result.success || !result.data) {
      console.error('API error:', result.error);
      return [];
    }
    
    if (result.cached) {
      console.log('Listings served from cache');
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to fetch listings from API:', error);
    return [];
  }
}

/**
 * Fetch all resale listings from the cached API
 */
export async function fetchResaleListingsFromAPI(): Promise<ResaleListingFromAPI[]> {
  try {
    const response = await fetch('/api/resale-listings');
    const result: APIResponse<ResaleListingFromAPI[]> = await response.json();
    
    if (!result.success || !result.data) {
      console.error('API error:', result.error);
      return [];
    }
    
    if (result.cached) {
      console.log('Resale listings served from cache');
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to fetch resale listings from API:', error);
    return [];
  }
}

/**
 * Parse metadata URI to extract listing details
 */
export function parseMetadataFromAPI(uri: string): { 
  name: string; 
  platform: string; 
  imageUrl: string; 
  description: string;
} {
  // Try to parse base64 JSON first
  if (uri.startsWith('data:application/json;base64,')) {
    try {
      const base64 = uri.replace('data:application/json;base64,', '');
      const json = JSON.parse(atob(base64));
      return {
        name: json.name || 'Untitled',
        platform: json.attributes?.find((a: { trait_type: string; value: string }) => a.trait_type === 'platform')?.value || 'Unknown',
        imageUrl: json.image || '',
        description: json.description || '',
      };
    } catch (e) {
      console.error('Failed to parse base64 metadata:', e);
    }
  }
  
  // Fallback: extract from URI path
  const parts = uri.replace('ipfs://', '').split('/');
  return {
    name: parts[parts.length - 1] || 'Untitled',
    platform: parts[0] || 'Unknown',
    imageUrl: '',
    description: '',
  };
}

