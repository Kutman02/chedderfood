
import { FaUser, FaPhone, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import type { Customer } from '../../types/types';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const fullName = `${customer.first_name} ${customer.last_name}`.trim() || customer.username;
  const totalSpent = parseFloat(customer.total_spent || '0');

  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-black">
            <FaUser />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{fullName}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {customer.billing.phone && (
          <div className="flex items-center gap-2 text-sm">
            <FaPhone className="text-slate-400" size={12} />
            <a href={`tel:${customer.billing.phone}`} className="text-orange-600 font-bold">
              {customer.billing.phone}
            </a>
          </div>
        )}
        
        {customer.billing.address_1 && (
          <div className="text-sm text-slate-600">
            <p className="font-semibold">{customer.billing.address_1}</p>
            {customer.billing.city && (
              <p className="text-xs text-slate-500">{customer.billing.city}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-200">
        <div className="flex-1 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaShoppingCart className="text-blue-600" size={14} />
            <span className="text-xs font-bold text-slate-600 uppercase">Заказов</span>
          </div>
          <p className="text-lg font-black text-blue-600">{customer.orders_count || 0}</p>
        </div>
        
        <div className="flex-1 bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaDollarSign className="text-green-600" size={14} />
            <span className="text-xs font-bold text-slate-600 uppercase">Потрачено</span>
          </div>
          <p className="text-lg font-black text-green-600">{totalSpent.toFixed(0)} сом</p>
        </div>
      </div>
    </div>
  );
};

