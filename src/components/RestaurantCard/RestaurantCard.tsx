import { FC, useState } from "react";
import Badge from "shared/Badge/Badge";
import NcImage from "shared/NcImage/NcImage";
import { StarIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import RestaurantMenuModal from "components/RestaurantMenuModal/RestaurantMenuModal";
import { Restaurant } from "services/restaurantService";

export interface RestaurantCardProps {
  className?: string;
  restaurant: Restaurant;
}

const RestaurantCard: FC<RestaurantCardProps> = ({
  className = "",
  restaurant,
}) => {
  const { ID, Name, Description, Location, rating, Cuisine, avg_price } = restaurant;
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);

  return (
    <>
      <div 
        className={`nc-RestaurantCard group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer ${className}`}
        onClick={() => setIsMenuModalOpen(true)}
      >
        <div className="relative flex-shrink-0">
          <div className="aspect-w-16 aspect-h-9 w-full h-0">
            <NcImage
              containerClassName="w-full h-full"
              className="object-cover w-full h-full rounded-t-2xl"
              src={`https://source.unsplash.com/random/800x600/?restaurant,${Cuisine}`}
              alt={Name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              className="relative inline-block px-2.5 py-1 text-xs font-medium text-white bg-primary-500"
              name={Location}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`nc-CardTitle text-lg font-semibold`}>
              <span className="line-clamp-1 hover:text-primary-500 transition-colors">
                {Name}
              </span>
            </h2>
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 space-x-4">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{Location}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{avg_price > 0 ? `Ortalama: ₺${avg_price}` : ''}</span>
            </div>
          </div>

          {Description && (
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {Description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary-500">Free Delivery</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">•</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Min. ₺50</span>
            </div>
            <span className="text-sm font-medium text-primary-500">
              View Menu →
            </span>
          </div>
        </div>
      </div>

      <RestaurantMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        restaurantId={ID}
        restaurantName={Name}
      />
    </>
  );
};

export default RestaurantCard; 