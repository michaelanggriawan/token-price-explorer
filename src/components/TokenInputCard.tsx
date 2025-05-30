import TokenDropdown from "@/components/TokenDropdown";
import type { SelectedToken } from '@/types';

interface Props {
  label: string;
  amount: string;
  onAmountChange: (val: string) => void;
  selectedToken: SelectedToken;
  onTokenClick: () => void;
  estimatedUSD?: number;
}

export default function TokenInputCard({
  label,
  amount,
  onAmountChange,
  selectedToken,
  onTokenClick,
  estimatedUSD,
}: Props) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-inner flex justify-between items-center">
      <div className="flex-1">
        <div className="text-xs text-gray-500 uppercase mb-1">{label}</div>
        <input
          type="number"
          value={amount}
          onFocus={(e) => {
            if (e.target.value === '0') {
            e.target.select();
            }
          }}
          onChange={e => onAmountChange(e.target.value)}
          className="text-3xl font-bold bg-transparent outline-none w-full text-black"
        />
        {estimatedUSD && (
          <div className="text-sm text-gray-400">≈ ${estimatedUSD.toFixed(2)}</div>
        )}
      </div>
      <TokenDropdown token={selectedToken} onClick={onTokenClick} />
    </div>
  );
}
