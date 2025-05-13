import { FC, useState } from "react";
import { StarIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Badge from "shared/Badge/Badge";
import NcImage from "shared/NcImage/NcImage";
import RestaurantMenuModal from "components/RestaurantMenuModal/RestaurantMenuModal";
import { Restaurant } from "services/restaurantService";

export interface RestaurantCardProps {
  className?: string;
  restaurant: Restaurant;
}

/**
 * Responsive restaurant preview card. Clicking opens the RestaurantMenuModal.
 */
const RestaurantCard: FC<RestaurantCardProps> = ({ className = "", restaurant }) => {
  const {
    id,
    name,
    description,
    location,
    rating,
    cuisine,
    avg_price,
    image_url,
  } = restaurant;

  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`nc-RestaurantCard group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
        onClick={() => setIsMenuModalOpen(true)}
      >
        {/* Image */}
        <div className="relative">
          <NcImage
            containerClassName="w-full aspect-[16/9]"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
            src={image_url}
            alt={name}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* location badge */}
          {location && (
            <div className="absolute top-3 right-3">
              <Badge className="!px-2.5 !py-1 bg-primary-500 text-xs text-white" name={location} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* title + rating */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold line-clamp-1 text-neutral-900 dark:text-neutral-100 group-hover:text-primary-500 transition-colors">
              {name}
            </h2>
            <div className="flex items-center gap-1">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* meta info */}
          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {cuisine && (
              <span className="capitalize">{cuisine}</span>
            )}
            {avg_price > 0 && (
              <span className="flex items-center gap-1">
                <BanknotesIcon className="w-4 h-4" />
                Avg: ₺{avg_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* description */}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {description}
            </p>
          )}

          {/* footer */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-sm font-medium text-primary-500">Free delivery</span>
            <span className="text-sm font-medium text-primary-500 group-hover:underline">View menu →</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RestaurantMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        restaurantId={id}
        restaurantName={name}
        restaurantImage={image_url}
        restaurantLocation={location}
        restaurantDescription={description}
        restaurantRating={rating}
        restaurantAvgPrice={avg_price}
      />
    </>
  );
};

export default RestaurantCard;