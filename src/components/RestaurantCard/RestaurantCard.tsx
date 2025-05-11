import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "shared/Badge/Badge";
import NcImage from "shared/NcImage/NcImage";
import { StarIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import RestaurantMenuModal from "components/RestaurantMenuModal/RestaurantMenuModal";

export interface RestaurantCardProps {
  className?: string;
  restaurant: {
    ID: number;
    Name: string;
    Description: string;
    Location: string;
  };
}

const RestaurantCard: FC<RestaurantCardProps> = ({
  className = "",
  restaurant,
}) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  // Generate random rating between 3.5 and 5
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  // Generate random delivery time between 15 and 45 minutes
  const deliveryTime = Math.floor(Math.random() * 30) + 15;

  return (
    <>
      <div
        className={`nc-RestaurantCard group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}
      >
        <div className="relative flex-shrink-0">
          <div className="aspect-w-16 aspect-h-9 w-full h-0">
            <NcImage
              containerClassName="w-full h-full"
              className="object-cover w-full h-full rounded-t-2xl"
              src={`https://source.unsplash.com/random/800x600/?restaurant,${restaurant.Name}`}
              alt={restaurant.Name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              className="relative inline-block px-2.5 py-1 text-xs font-medium text-white bg-primary-500"
              name={restaurant.Location}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`nc-CardTitle text-lg font-semibold`}>
              <Link to={`/restaurant/${restaurant.ID}`} className="line-clamp-1 hover:text-primary-500 transition-colors">
                {restaurant.Name}
              </Link>
            </h2>
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 space-x-4">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{restaurant.Location}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{deliveryTime} min</span>
            </div>
          </div>

          {restaurant.Description && (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {restaurant.Description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary-500">Free Delivery</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">•</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Min. ₺50</span>
            </div>
            <button
              onClick={() => setIsMenuModalOpen(true)}
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              View Menu →
            </button>
          </div>
        </div>
      </div>

      <RestaurantMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        restaurantId={restaurant.ID}
        restaurantName={restaurant.Name}
      />
    </>
  );
};

export default RestaurantCard; 