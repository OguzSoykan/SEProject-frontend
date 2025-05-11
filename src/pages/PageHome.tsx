import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import RestaurantCard from "components/RestaurantCard/RestaurantCard";
import { restaurantService, Restaurant } from "services/restaurantService";
import SectionHero from "components/Sections/SectionHero";

const PageHome: FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Restaurants || Food Ordering App</title>
      </Helmet>

      <div className="container relative">
        <SectionHero
          className="pb-10 lg:pb-16 lg:pt-6"
          heading="Discover Amazing Restaurants"
          subHeading="Find and order from the best restaurants in your area"
        />

        {loading ? (
          <div className="text-center py-10">Loading restaurants...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.ID}
                restaurant={restaurant}
                className="bg-white dark:bg-neutral-900"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHome; 