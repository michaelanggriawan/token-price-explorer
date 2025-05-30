import type { Token } from '@/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ImageIcon, Loader2, Search } from 'lucide-react';

export default function TokenSelectModal({
  tokens,
  onSelect,
  onClose,
}: {
  tokens: Token[];
  onSelect: (t: Token & { selectedTokenSymbol: string }) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [errored, setErrored] = useState<Record<number, boolean>>({});
  const [expandedChainId, setExpandedChainId] = useState<number | null>(null);
  const [loadingSymbol, setLoadingSymbol] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const filteredChains = tokens.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.nativeCurrency.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.chainId.toString().includes(search)
  );

  const handleTokenSelect = async (chain: Token, symbol: string) => {
    setErrorMessage(null);
    setLoadingSymbol(`${chain.chainId}-${symbol}`);
    try {
      await onSelect({ ...chain, selectedTokenSymbol: symbol });
    } catch (err: unknown) {
      let message = 'Something went wrong. Please try again.';
      try {
        const matched = err.message.match(/{.*}/);
        if (matched) {
          const parsed = JSON.parse(matched[0]);
          if (parsed?.errorMsg) message = parsed.errorMsg;
        }
      } catch (_) {}
      setErrorMessage(message);
    } finally {
      setLoadingSymbol(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[80vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Select token</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer">✕</button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by chain name or symbol"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded text-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorMessage && (
          <div className="mb-3 px-3 py-2 bg-red-50 text-sm text-red-700 border border-red-200 rounded">
            {errorMessage}
          </div>
        )}

        <div className="space-y-3">
          {filteredChains.map(chain => (
            <div key={chain.chainId} className="border border-gray-200 rounded-lg">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedChainId(prev => prev === chain.chainId ? null : chain.chainId)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 relative rounded-full overflow-hidden">
                    {!errored[chain.chainId] ? (
                      <Image
                        src={`https://cryptoicon-api.pages.dev/api/icon/${chain.nativeCurrency.symbol.toLowerCase()}`}
                        alt={chain.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                        onError={() => setErrored(prev => ({ ...prev, [chain.chainId]: true }))}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{chain.nativeCurrency.symbol}</div>
                    <div className="text-xs text-gray-500">{chain.name}</div>
                  </div>
                </div>
                {expandedChainId === chain.chainId ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {expandedChainId === chain.chainId && chain.supportedTokens && (
                <div className="p-3 flex flex-wrap gap-2 border-t">
                  {chain.supportedTokens.map(symbol => {
                    const isLoading = loadingSymbol === `${chain.chainId}-${symbol}`;
                    return (
                      <button
                        key={symbol}
                        onClick={() => handleTokenSelect(chain, symbol)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {symbol}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
