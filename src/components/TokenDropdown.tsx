import { ChevronDown, ShieldCheck, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { SelectedToken } from '@/types';

export default function TokenDropdown({ token, onClick }: { token: SelectedToken; onClick: () => void }) {
  const [imageError, setImageError] = useState(false);
  const iconUrl = `https://cryptoicon-api.pages.dev/api/icon/${token.symbol.toLowerCase()}`

  return (
    <button
      onClick={onClick}
      className="ml-4 flex items-center bg-white hover:bg-gray-100 rounded-full px-4 py-1.5 shadow border cursor-pointer"
    >
      <div className="w-5 h-5 relative rounded-full overflow-hidden mr-2 flex items-center justify-center bg-gray-100">
        {!imageError ? (
          <Image
            src={iconUrl}
            alt={token.symbol}
            width={20}
            height={20}
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageIcon className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <span className="font-medium text-sm text-black mr-1">{token.symbol}</span>
      <ShieldCheck className="w-4 h-4 text-blue-500 mr-1" />
      <ChevronDown className="w-4 h-4 text-gray-500" />
    </button>
  );
}
