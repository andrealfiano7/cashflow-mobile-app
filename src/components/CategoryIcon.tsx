import React from 'react';
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  ArrowDownLeft,
  PlusCircle,
  ShoppingBag,
  Home,
  Utensils,
  FileText,
  Car,
  Film,
  ArrowUpRight,
  MinusCircle,
  Tag,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const cleanName = name.toLowerCase();

  if (cleanName.includes('gaji') || cleanName.includes('upah')) {
    return <Wallet className={className} />;
  }
  if (cleanName.includes('jual') || cleanName.includes('bisnis') || cleanName.includes('omset')) {
    return <TrendingUp className={className} />;
  }
  if (cleanName.includes('dividen') || cleanName.includes('invest')) {
    return <PiggyBank className={className} />;
  }
  if (cleanName.includes('transfer masuk') || cleanName.includes('inflow')) {
    return <ArrowDownLeft className={className} />;
  }
  if (cleanName.includes('belanja')) {
    return <ShoppingBag className={className} />;
  }
  if (cleanName.includes('kebutuhan') || cleanName.includes('rumah')) {
    return <Home className={className} />;
  }
  if (cleanName.includes('makan') || cleanName.includes('minum') || cleanName.includes('resto') || cleanName.includes('kopi')) {
    return <Utensils className={className} />;
  }
  if (cleanName.includes('tagihan') || cleanName.includes('listrik') || cleanName.includes('air')) {
    return <FileText className={className} />;
  }
  if (cleanName.includes('transport') || cleanName.includes('kendaraan') || cleanName.includes('bensin')) {
    return <Car className={className} />;
  }
  if (cleanName.includes('hiburan') || cleanName.includes('liburan') || cleanName.includes('film')) {
    return <Film className={className} />;
  }
  if (cleanName.includes('transfer keluar')) {
    return <ArrowUpRight className={className} />;
  }
  if (cleanName.includes('masuk')) {
    return <PlusCircle className={className} />;
  }
  if (cleanName.includes('keluar')) {
    return <MinusCircle className={className} />;
  }

  return <Tag className={className} />;
};
