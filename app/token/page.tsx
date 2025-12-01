"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <motion.div {...fadeIn}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">The Token</h1>
            <p className="text-xl text-white/60 max-w-2xl">
              Real utility from day one. Value backed by platform performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div {...fadeIn} className="grid md:grid-cols-3 gap-8">
            <div className="border-l-4 border-black pl-6">
              <p className="text-lg font-medium">The marketplace runs independently of the token.</p>
            </div>
            <div className="border-l-4 border-black pl-6">
              <p className="text-lg font-medium">The token has real utility from day one.</p>
            </div>
            <div className="border-l-4 border-black pl-6">
              <p className="text-lg font-medium">Value is supported by transparent buybacks and burns.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Utility */}
      <section className="border-b border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold">Token Utility</h2>
              <span className="px-3 py-1 bg-black text-white text-sm font-medium">LIVE AT LAUNCH</span>
            </div>
            <p className="text-black/60 mb-12 max-w-2xl">
              These mechanics are active from day one, creating immediate value linkage between platform success and token demand.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Buybacks */}
              <div className="border border-black p-8 bg-white">
                <h3 className="text-2xl font-bold mb-4">3× Automated Buybacks</h3>
                <p className="text-black/70 mb-6">
                  The platform buys back <span className="font-bold">3× the platform&apos;s profit</span> from each transaction.
                </p>
                
                <div className="bg-gray-50 border border-black/10 p-6 mb-6">
                  <p className="text-sm text-black/60 mb-2">Example</p>
                  <p className="text-lg">
                    If the platform earns <span className="font-bold">1 USDC</span> in revenue, 
                    it automatically purchases <span className="font-bold">3 USDC</span> worth of the token.
                  </p>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Constant buy pressure on every transaction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Direct linkage between platform success and token demand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Value distribution to all holders</span>
                  </li>
                </ul>
                
                <p className="text-sm text-black/50 mt-6 pt-6 border-t border-black/10">
                  Implemented via server-side listener that monitors transactions, calculates revenue, and executes automated purchases.
                </p>
              </div>

              {/* Burns */}
              <div className="border border-black p-8 bg-white">
                <h3 className="text-2xl font-bold mb-4">Automatic Burns</h3>
                <p className="text-black/70 mb-6">
                  All tokens purchased via the 3× buyback are sent to the <span className="font-bold">Sol Incinerator</span> address, permanently removing them from supply.
                </p>
                
                <div className="bg-black text-white p-6 mb-6 font-mono text-sm break-all">
                  1nc1nerator11111111111111111111111111111111
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Deflationary supply mechanics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Long-term scarcity guaranteed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                    <span>Transparent and on-chain verification</span>
                  </li>
                </ul>
                
                <p className="text-sm text-black/50 mt-6 pt-6 border-t border-black/10">
                  Every burn transaction is publicly verifiable on Solana explorers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Utility */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold">Future Utility</h2>
              <span className="px-3 py-1 border border-black text-sm font-medium">ROADMAP</span>
            </div>
            <p className="text-black/60 mb-12 max-w-2xl">
              Additional utilities introduced as the platform matures.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Reduced Fees */}
              <div className="border border-black p-6">
                <h3 className="text-lg font-bold mb-3">Reduced Marketplace Fees</h3>
                <p className="text-black/60 text-sm mb-4">
                  Token holders receive reduced fees on primary and secondary market transactions.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-black/10">
                    <span className="text-black/60">Base Fee</span>
                    <span className="font-medium">Standard</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-black/10">
                    <span className="text-black/60">Token Holders</span>
                    <span className="font-medium">Reduced</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-black/60">Stakers</span>
                    <span className="font-medium">Further Reduced</span>
                  </div>
                </div>
              </div>

              {/* Priority Boost */}
              <div className="border border-black p-6">
                <h3 className="text-lg font-bold mb-3">Priority Boost for Creators</h3>
                <p className="text-black/60 text-sm mb-4">
                  Creators can pay fees in the token to receive enhanced visibility.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-black mt-2 flex-shrink-0" />
                    <span>Featured placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-black mt-2 flex-shrink-0" />
                    <span>Boosted visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-black mt-2 flex-shrink-0" />
                    <span>Higher indexing priority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-black mt-2 flex-shrink-0" />
                    <span>Verified royalty audit tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Onboarding Incentives */}
      <section className="border-b border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold mb-4">Creator Onboarding Incentives</h2>
            <p className="text-black/60 mb-12 max-w-2xl">
              Using PumpFun developer fees to protect and incentivize early creators.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">How It Works</h3>
                <p className="text-black/70 mb-6">
                  When the token launches on PumpFun, the developer wallet receives a fee from every trade. 
                  These earnings are allocated to a creator protection fund.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium">Fund Creation</p>
                      <p className="text-sm text-black/60">PumpFun dev fees accumulate in protection fund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium">Creator Protection</p>
                      <p className="text-sm text-black/60">Fund protects early creators from poor sale outcomes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium">Risk Reduction</p>
                      <p className="text-sm text-black/60">Makes early adoption more attractive for quality creators</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-black p-8 bg-white">
                <h3 className="text-lg font-bold mb-4">Example</h3>
                <p className="text-black/70 mb-6">
                  If a creator sells royalties worth 1,000 USDC but later regrets it due to volatility or low pricing:
                </p>
                <div className="bg-gray-50 border border-black/10 p-6">
                  <p className="text-2xl font-bold mb-2">Up to 50%</p>
                  <p className="text-black/60">reimbursement based on pre-determined rules</p>
                </div>
                <div className="mt-6 pt-6 border-t border-black/10">
                  <p className="text-sm font-medium mb-2">Purpose</p>
                  <ul className="space-y-2 text-sm text-black/60">
                    <li>• Encourage high-quality creators to list early</li>
                    <li>• Build trust and participation</li>
                    <li>• Position the platform as creator-first</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Docs Link */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div {...fadeIn} className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Full Documentation</h3>
              <p className="text-black/60">
                Fee structure, trading mechanics, NFT mechanics, contract legality, and more.
              </p>
            </div>
            <Link
              href="/docs"
              className="px-8 py-4 bg-black text-white font-medium hover:bg-black/80 transition-colors whitespace-nowrap"
            >
              Read the Docs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div {...fadeIn} className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
            <p className="text-white/60 leading-relaxed">
              The token described on this page is designed for platform utility purposes only. 
              It is not marketed, sold, or offered as an investment vehicle. The token&apos;s 
              primary function is to enable specific features within the platform ecosystem, 
              including but not limited to fee reductions, reputation boosting, and governance 
              participation. Nothing on this page constitutes financial advice or an offer 
              to sell securities.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
