import React from 'react';

interface AdminCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: { label: string; value: string | number }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'danger' | 'secondary';
  }[];
  className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  subtitle,
  description,
  metadata,
  actions,
  className = '',
}) => {
  const getButtonClass = (variant: string = 'primary') => {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
    switch (variant) {
      case 'danger':
        return `${baseClass} bg-red-500 hover:bg-red-600 text-white`;
      case 'secondary':
        return `${baseClass} bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200`;
      default:
        return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white`;
    }
  };

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              {description}
            </p>
          )}
          {metadata && metadata.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {metadata.map((item, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{item.label}: </span>
                  <span className="text-gray-900 dark:text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={getButtonClass(action.variant)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard; 