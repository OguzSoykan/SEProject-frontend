import React, { useEffect, useState, useMemo } from "react";
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
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    location: '',
    maxPrice: '',
    minRating: ''
  });

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

  // Türkçe karakterleri normalize et
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[Ğ]/g, 'G')
      .replace(/[Ü]/g, 'U')
      .replace(/[Ş]/g, 'S')
      .replace(/[İ]/g, 'I')
      .replace(/[Ö]/g, 'O')
      .replace(/[Ç]/g, 'C');
  };

  // Client-side filtreleme
  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = normalizeText(filters.search);
    
    return restaurants.filter(restaurant => {
      // Arama filtresi (isim ve açıklamada ara)
      if (filters.search) {
        const normalizedName = normalizeText(restaurant.name);
        const normalizedDesc = normalizeText(restaurant.description);
        
        if (!normalizedName.includes(normalizedSearch) && 
            !normalizedDesc.includes(normalizedSearch)) {
          return false;
        }
      }

      // Mutfak filtresi
      if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
        return false;
      }

      // Lokasyon filtresi
      if (filters.location && restaurant.location !== filters.location) {
        return false;
      }

      // Fiyat filtresi
      if (filters.maxPrice && restaurant.avg_price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Rating filtresi
      if (filters.minRating && restaurant.rating < parseFloat(filters.minRating)) {
        return false;
      }

      return true;
    });
  }, [restaurants, filters]);

  // Popüler lokasyonları hesapla
  const popularLocations = useMemo(() => {
    const locationCounts: Record<string, number> = {};
    restaurants.forEach((r) => {
      if (r.location) {
        locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
      }
    });
    return Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [restaurants]);

  // Benzersiz mutfak türlerini hesapla
  const uniqueCuisines = useMemo(() => {
    const cuisines = new Set(restaurants.map(r => r.cuisine));
    return Array.from(cuisines).sort();
  }, [restaurants]);

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Restaurants || Food Ordering App</title>
      </Helmet>

      {/* SECTION HERO */}
      {/* <SectionHero
          className="pb-10 lg:pb-16 lg:pt-6"
          heading="Discover Amazing Restaurants"
          subHeading="Find and order from the best restaurants in your area"
        /> */}

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
       {/* 🔍 SEARCH + FILTER FORM */}
      <div className="container mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search restaurant..."
            className="p-2 border border-neutral-300 rounded-md"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          
          {/* Cuisine dropdown */}
          <select
            className="p-2 border border-neutral-300 rounded-md"
            value={filters.cuisine}
            onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
          >
            <option value="">All Cuisines</option>
            {uniqueCuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>

          {/* Location dropdown */}
          <select
            className="p-2 border border-neutral-300 rounded-md"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="">All Locations</option>
            {popularLocations.map(([location]) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Average Price dropdown */}
          <select
            className="p-2 border border-neutral-300 rounded-md"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          >
            <option value="">Any Price</option>
            <option value="50">Up to ₺50</option>
            <option value="100">Up to ₺100</option>
            <option value="150">Up to ₺150</option>
            <option value="1000">₺150+</option>
          </select>

          {/* Rating dropdown */}
          <select
            className="p-2 border border-neutral-300 rounded-md"
            value={filters.minRating}
            onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
          >
            <option value="">Any Rating</option>
            <option value="1.0">1.0+</option>
            <option value="2.0">2.0+</option>
            <option value="3.0">3.0+</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
      </div>
    
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
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">No restaurants found matching your criteria.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
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
              {popularLocations.map(([location, count]) => (
                <div
                  key={location}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setFilters(prev => ({ ...prev, location }))}
                >
                  <h3 className="text-lg font-semibold">{location}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    {count} restaurants
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