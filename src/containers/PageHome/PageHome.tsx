import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionHero from "components/Sections/SectionHero";
import RestaurantCard from "components/RestaurantCard/RestaurantCard";
import { restaurantService, Restaurant } from "services/restaurantService";
import Heading from "components/Heading/Heading";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionPromo1 from "components/SectionPromo1";
import SectionHero2 from "components/SectionHero/SectionHero2";
import SectionSliderLargeProduct from "components/SectionSliderLargeProduct";
import SectionSliderProductCard from "components/SectionSliderProductCard";
import DiscoverMoreSlider from "components/DiscoverMoreSlider";
import SectionGridMoreExplore from "components/SectionGridMoreExplore/SectionGridMoreExplore";
import SectionPromo2 from "components/SectionPromo2";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import SectionGridFeatureItems from "./SectionGridFeatureItems";
import SectionPromo3 from "components/SectionPromo3";
import SectionClientSay from "components/SectionClientSay/SectionClientSay";
import SectionMagazine5 from "containers/BlogPage/SectionMagazine5";

function PageHome() {
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

      {/* SECTION HERO */}
      <SectionHero
        className="pb-10 lg:pb-16 lg:pt-6"
        heading="Discover Amazing Restaurants"
        subHeading="Find and order from the best restaurants in your area"
      />

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* RESTAURANT LISTINGS */}
        <div>
          <Heading
            className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
            desc="Explore our curated selection of restaurants"
            rightDescText="Best restaurants in your area"
            hasNextPrev
          >
            Featured Restaurants
          </Heading>

          {loading ? (
            <div className="text-center py-10">Loading restaurants...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.ID}
                  restaurant={restaurant}
                  className="bg-white dark:bg-neutral-900"
                />
              ))}
            </div>
          )}

          <div className="flex mt-16 justify-center">
            <ButtonSecondary>View all restaurants</ButtonSecondary>
          </div>
        </div>

        {/* FEATURED LOCATIONS */}
        <div className="relative py-24 lg:py-32 bg-neutral-100 dark:bg-neutral-800 rounded-3xl">
          <div className="container">
            <Heading
              className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
              desc="Find restaurants in your favorite locations"
            >
              Popular Locations
            </Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {['Istanbul', 'Ankara', 'Izmir', 'Antalya'].map((location) => (
                <div
                  key={location}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">{location}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    {restaurants.filter(r => r.Location === location).length} restaurants
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
