'use client';

import { useState, useEffect } from 'react';
import TokenInputCard from '@/components/TokenInputCard';
import TokenSelectModal from '@/components/TokenSelectModal';
import SwapIcon from '@/components/SwapIcon';
import type { SelectedToken, Token } from '@/types';
import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import evmChains from '@/data/evm_chains.json';
import { defaultToken } from '@/constant';

export default function Page() {
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isSelectingFrom, setIsSelectingFrom] = useState(true);
  const [fromToken, setFromToken] = useState<SelectedToken>(defaultToken);
  const [toToken, setToToken] = useState<SelectedToken>(defaultToken);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');

  useEffect(() => {
    setTokens(evmChains);
  }, []);

  useEffect(() => {
    if (!fromToken.tokenPrice || !toToken.tokenPrice) return;

    const fromUnit = fromToken.tokenPrice.unitPrice;
    const toUnit = toToken.tokenPrice.unitPrice;
    const rate = fromUnit / toUnit;

    const fromDecimals = fromToken.decimals ?? 8;
    const toDecimals = toToken.decimals ?? 8;

    const formatValue = (val: number, decimals: number) =>
      val.toLocaleString('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: 0,
        useGrouping: false,
      });

    if (lastEdited === 'from') {
      const value = parseFloat(fromAmount);
      if (!isNaN(value)) {
        const result = value === 0 ? '0' : formatValue(value * rate, toDecimals);
        setToAmount(result);
      }
    } else {
      const value = parseFloat(toAmount);
      if (!isNaN(value)) {
        const result = value === 0 ? '0' : formatValue(value / rate, fromDecimals);
        setFromAmount(result);
      }
    }
  }, [fromAmount, toAmount, fromToken, toToken, lastEdited]);

  const handleTokenClick = (isFrom: boolean) => {
    setIsSelectingFrom(isFrom);
    setShowTokenModal(true);
  };

  const handleSelectToken = async (token: Token & { selectedTokenSymbol: string }) => {
    try {
      const tokenInfo = await getAssetErc20ByChainAndSymbol({
        chainId: token.chainId.toString(),
        symbol: token.selectedTokenSymbol,
        apiKey: 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk',
      });

      const tokenPrice = await getAssetPriceInfo({
        chainId: token.chainId.toString(),
        assetTokenAddress: tokenInfo.address,
        apiKey: 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk',
      });

      const enrichedToken: SelectedToken = {
        chain: token.chainId.toString(),
        name: token.name,
        symbol: token.selectedTokenSymbol,
        address: tokenInfo.address,
        decimals: tokenInfo.decimals,
        tokenPrice,
      };

      if (isSelectingFrom) {
        setFromToken(enrichedToken);
      } else {
        setToToken(enrichedToken);
      }

      setShowTokenModal(false);
    } catch (err) {
      console.error('Failed to fetch token info:', err);
      throw err;
    }
  };

  const handleSwap = () => {
    const tempAmount = fromAmount;
    const tempToken = fromToken;

    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setFromToken(toToken);
    setToToken(tempToken);
    setLastEdited('from');
  };

  const parseUSD = (amount: string, unitPrice: number | undefined) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || !unitPrice) return 0;
    return parsed * unitPrice;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4">
        <TokenInputCard
          label="FROM"
          amount={fromAmount}
          onAmountChange={(val) => {
            setFromAmount(val === '' ? '0' : val);
            setLastEdited('from');
          }}
          selectedToken={fromToken}
          onTokenClick={() => handleTokenClick(true)}
          estimatedUSD={parseUSD(fromAmount, fromToken.tokenPrice?.unitPrice)}
        />

        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="bg-white border p-2 rounded-full shadow hover:bg-gray-50"
          >
            <SwapIcon />
          </button>
        </div>

        <TokenInputCard
          label="TO"
          amount={toAmount}
          onAmountChange={(val) => {
            setToAmount(val === '' ? '0' : val);
            setLastEdited('to');
          }}
          selectedToken={toToken}
          onTokenClick={() => handleTokenClick(false)}
          estimatedUSD={parseUSD(toAmount, toToken.tokenPrice?.unitPrice)}
        />
      </div>

      {showTokenModal && (
        <TokenSelectModal
          tokens={tokens}
          onSelect={handleSelectToken}
          onClose={() => setShowTokenModal(false)}
        />
      )}
    </main>
  );
}
