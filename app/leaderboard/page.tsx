"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

// Placeholder creator leaderboard data
const creatorsData = [
  { rank: 1, name: "Maya Chen", handle: "mayamusic", totalRaised: "$48,200", contractsSold: 12, profileLink: "/creator/maya-chen" },
  { rank: 2, name: "Alex Rivera", handle: "alextech", totalRaised: "$36,500", contractsSold: 8, profileLink: "/creator/alex-rivera" },
  { rank: 3, name: "Jordan Blake", handle: "jblakestreams", totalRaised: "$28,900", contractsSold: 7, profileLink: "/creator/jordan-blake" },
  { rank: 4, name: "Taylor Reed", handle: "taylorgames", totalRaised: "$24,100", contractsSold: 5, profileLink: "/creator/taylor-reed" },
  { rank: 5, name: "Sam Foster", handle: "samfoster_art", totalRaised: "$19,800", contractsSold: 6, profileLink: "/creator/sam-foster" },
  { rank: 6, name: "Drew Simmons", handle: "drewpodcast", totalRaised: "$15,400", contractsSold: 4, profileLink: "/creator/drew-simmons" },
  { rank: 7, name: "Riley Hayes", handle: "rileywriter", totalRaised: "$12,600", contractsSold: 3, profileLink: "/creator/riley-hayes" },
  { rank: 8, name: "Casey Morgan", handle: "caseyreads", totalRaised: "$10,200", contractsSold: 4, profileLink: "/creator/casey-morgan" },
  { rank: 9, name: "Avery Quinn", handle: "averydev", totalRaised: "$8,900", contractsSold: 2, profileLink: "/creator/avery-quinn" },
  { rank: 10, name: "Morgan Ellis", handle: "morganvlogs", totalRaised: "$7,500", contractsSold: 3, profileLink: "/creator/morgan-ellis" },
];

// Placeholder trader leaderboard data
const tradersData = [
  { rank: 1, name: "whale.sol", wallet: "8xH3...k9Pm", volume: "$124,500", trades: 47, pnl: "+$18,200", winRate: "72%" },
  { rank: 2, name: "cryptoking", wallet: "4rKm...Xt7n", volume: "$89,200", trades: 32, pnl: "+$12,400", winRate: "68%" },
  { rank: 3, name: "royalty_hunter", wallet: "9pLq...Wz2a", volume: "$67,800", trades: 28, pnl: "+$9,100", winRate: "64%" },
  { rank: 4, name: "alpha_seeker", wallet: "2bNr...Hy6c", volume: "$54,300", trades: 41, pnl: "+$7,800", winRate: "61%" },
  { rank: 5, name: "degen_trader", wallet: "7vCx...Jm4k", volume: "$48,900", trades: 56, pnl: "+$5,200", winRate: "54%" },
  { rank: 6, name: "smart_money", wallet: "1zQw...Tf9s", volume: "$42,100", trades: 19, pnl: "+$8,900", winRate: "79%" },
  { rank: 7, name: "yield_farmer", wallet: "5kPn...Rx3m", volume: "$38,600", trades: 24, pnl: "+$4,100", winRate: "58%" },
  { rank: 8, name: "royalty_whale", wallet: "3mVb...Qs8j", volume: "$31,200", trades: 15, pnl: "+$6,700", winRate: "73%" },
  { rank: 9, name: "trade_master", wallet: "6hLc...Wn2p", volume: "$27,800", trades: 33, pnl: "+$3,400", winRate: "52%" },
  { rank: 10, name: "token_sniper", wallet: "8pRx...Km5t", volume: "$24,100", trades: 38, pnl: "+$2,900", winRate: "55%" },
];

type Tab = "creators" | "traders";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("traders");

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <SectionHeader
            title="Leaderboard"
            subtitle="Top creators and traders on the platform. Track performance, volume, and market activity."
          />

          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="border border-black p-4">
              <p className="text-sm text-black/60">Total Volume</p>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
            <div className="border border-black p-4">
              <p className="text-sm text-black/60">Secondary Trades</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div className="border border-black p-4">
              <p className="text-sm text-black/60">Active Traders</p>
              <p className="text-2xl font-bold">312</p>
            </div>
            <div className="border border-black p-4">
              <p className="text-sm text-black/60">24h Volume</p>
              <p className="text-2xl font-bold">$48,200</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-0 mt-8 border border-black inline-flex">
            <button
              onClick={() => setActiveTab("traders")}
              className={`px-8 py-3 font-medium text-sm transition-colors ${
                activeTab === "traders"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Top Traders
              <span className="ml-2 text-xs opacity-60">SECONDARY</span>
            </button>
            <button
              onClick={() => setActiveTab("creators")}
              className={`px-8 py-3 font-medium text-sm transition-colors border-l border-black ${
                activeTab === "creators"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Top Creators
              <span className="ml-2 text-xs opacity-60">PRIMARY</span>
            </button>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <AnimatePresence mode="wait">
            {activeTab === "traders" ? (
              <motion.div
                key="traders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="border border-black p-4 text-center font-bold w-20">Rank</th>
                        <th className="border border-black p-4 text-left font-bold">Trader</th>
                        <th className="border border-black p-4 text-right font-bold w-40">Volume</th>
                        <th className="border border-black p-4 text-center font-bold w-24">Trades</th>
                        <th className="border border-black p-4 text-right font-bold w-32">P&L</th>
                        <th className="border border-black p-4 text-center font-bold w-28">Win Rate</th>
                        <th className="border border-black p-4 text-center font-bold w-32">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradersData.map((trader) => (
                        <tr
                          key={trader.rank}
                          className="bg-white hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-black p-4 text-center font-bold text-lg">
                            {trader.rank}
                          </td>
                          <td className="border border-black p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-sm">
                                {trader.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold">{trader.name}</p>
                                <p className="text-sm text-black/60 font-mono">{trader.wallet}</p>
                              </div>
                            </div>
                          </td>
                          <td className="border border-black p-4 text-right font-bold">
                            {trader.volume}
                          </td>
                          <td className="border border-black p-4 text-center font-medium">
                            {trader.trades}
                          </td>
                          <td className="border border-black p-4 text-right font-bold text-green-600">
                            {trader.pnl}
                          </td>
                          <td className="border border-black p-4 text-center">
                            <span className={`font-bold ${
                              parseInt(trader.winRate) >= 60 ? "text-green-600" : "text-black"
                            }`}>
                              {trader.winRate}
                            </span>
                          </td>
                          <td className="border border-black p-4 text-center">
                            <Link
                              href={`/trader/${trader.wallet}`}
                              className="inline-block px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="creators"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="border border-black p-4 text-center font-bold w-20">Rank</th>
                        <th className="border border-black p-4 text-left font-bold">Creator</th>
                        <th className="border border-black p-4 text-right font-bold w-48">Total Raised (USDC)</th>
                        <th className="border border-black p-4 text-center font-bold w-40">Contracts Sold</th>
                        <th className="border border-black p-4 text-center font-bold w-32">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creatorsData.map((creator) => (
                        <tr
                          key={creator.rank}
                          className="bg-white hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-black p-4 text-center font-bold text-lg">
                            {creator.rank}
                          </td>
                          <td className="border border-black p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-sm">
                                {creator.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold">{creator.name}</p>
                                <p className="text-sm text-black/60">@{creator.handle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="border border-black p-4 text-right font-bold">
                            {creator.totalRaised}
                          </td>
                          <td className="border border-black p-4 text-center font-medium">
                            {creator.contractsSold}
                          </td>
                          <td className="border border-black p-4 text-center">
                            <Link
                              href={creator.profileLink}
                              className="inline-block px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more */}
          <div className="mt-12 text-center">
            <button className="px-8 py-4 border-2 border-black font-medium hover:bg-black hover:text-white transition-colors">
              Load More
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/20 p-8 hover:border-white/40 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Start Trading</h3>
              <p className="text-white/60 mb-6">
                Buy and sell royalty tokens on the secondary market. Speculate on creator success.
              </p>
              <Link
                href="/marketplace"
                className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
            <div className="border border-white/20 p-8 hover:border-white/40 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Become a Creator</h3>
              <p className="text-white/60 mb-6">
                Tokenize your future revenue and raise capital from your community.
              </p>
              <Link
                href="/sell"
                className="inline-block px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors"
              >
                Sell Royalties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
