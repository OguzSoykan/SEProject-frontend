import React from 'react';

export interface AdminCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  metadata: { label: string; value: string }[];
  actions: {
    label: string;
    onClick: () => void;
    variant: 'primary' | 'danger';
  }[];
  className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  metadata,
  actions,
  className = "",
}) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {imageUrl && (
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        
        <div className="mt-4 space-y-2">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{item.label}:</span>
              <span className="text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-3 py-1 text-sm rounded-md ${
                action.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCard; 