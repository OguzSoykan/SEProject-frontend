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
  const [filters, setFilters] = useState({
    q: '',
    cuisine: '',
    location: '',
    price: '',
    rating: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        console.log("GET data ->", data); // 🔍 BURAYI EKLE
      setRestaurants(data);
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

   // 🔎 Filtrele (query parametrelerini backend'e yolla)
  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.q) params.append("q", filters.q);
    if (filters.cuisine) params.append("cuisine", filters.cuisine);
    if (filters.location) params.append("location", filters.location);
    if (filters.price) params.append("price", filters.price);
    if (filters.rating) params.append("rating", filters.rating);

    try {
      const data: any = await restaurantService.getFilteredRestaurants(params.toString());
 // ✅ Gerçek hata değilse: boş liste kontrolü
  
  const result = Array.isArray(data) ? data : data.data;
  setRestaurants(result);

  if (result.length === 0) {
    setError("No restaurants found matching your criteria.");
  } else {
    setError(null);
  }
} catch (err) {
  console.error("Filter fetch failed:", err);
  setError("Failed to fetch filtered restaurants."); // sadece fetch patlarsa
}
};

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
        <form
          onSubmit={handleFilter}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <input
            type="text"
            placeholder="Search restaurant..."
            className="p-2 border border-neutral-300 rounded-md"
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
          />
          {/* Cuisine dropdown */}
    <select
      className="p-2 border border-neutral-300 rounded-md"
      onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
    >
      <option value="">All Cuisines</option>
      <option value="Turkish">Turkish</option>
      <option value="Japanese">Japanese</option>
      <option value="Italian">Italian</option>
      <option value="American">American</option>
    </select>

    {/* Location dropdown */}
    <select
      className="p-2 border border-neutral-300 rounded-md"
      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
    >
      <option value="">All Locations</option>
      <option value="Istanbul">Istanbul</option>
      <option value="Ankara">Ankara</option>
      <option value="Izmir">Izmir</option>
      <option value="Bursa">Bursa</option>
      <option value="Antalya">Antalya</option>
    </select>

    {/* Average Price dropdown */}
    <select
      className="p-2 border border-neutral-300 rounded-md"
      onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
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
      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
    >
      <option value="">Any Rating</option>
      <option value="1.0">1.0+</option>
      <option value="2.0">2.0+</option>
      <option value="3.0">3.0+</option>
      <option value="4.0">4.0+</option>
      <option value="4.5">4.5+</option>
    </select>

          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              🔍 Apply Filters
            </button>
          </div>
        </form>
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
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {restaurants.map((restaurant) => (
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
              {['Istanbul', 'Ankara', 'Izmir', 'Antalya'].map((location) => (
                <div
                  key={location}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">{location}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    {Array.isArray(restaurants) ? restaurants.filter(r => r.location === location).length : 0} restaurants
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
