import React from 'react';
import { CheckCircle2, Clock, Truck, Package, Home, XCircle } from 'lucide-react';

export default function OrderTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: 16, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <XCircle size={24} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Order Cancelled</div>
          <div style={{ fontSize: 13 }}>This order was cancelled and inventory has been returned.</div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const statusOrder = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Background track line */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '5%',
            right: '5%',
            height: 3,
            backgroundColor: '#e2e8f0',
            zIndex: 1,
          }}
        />
        {/* Active track line */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '5%',
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 90)}%`,
            height: 3,
            backgroundColor: '#2563eb',
            zIndex: 2,
            transition: 'width 0.4s ease',
          }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 5,
                position: 'relative',
                flex: 1,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  backgroundColor: isCompleted ? '#2563eb' : '#ffffff',
                  border: `2px solid ${isCompleted ? '#2563eb' : '#cbd5e1'}`,
                  color: isCompleted ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              >
                <Icon size={18} />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: isCompleted ? 700 : 500,
                  color: isCompleted ? '#0f172a' : '#94a3b8',
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
