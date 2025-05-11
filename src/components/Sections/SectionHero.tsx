import { FC } from "react";

export interface SectionHeroProps {
  className?: string;
  heading?: string;
  subHeading?: string;
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  heading = "Discover Amazing Restaurants",
  subHeading = "Find and order from the best restaurants in your area",
}) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 lg:space-y-10 pb-14 lg:pb-64 xl:pb-80 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl leading-[110%]">
            {heading}
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            {subHeading}
          </span>
        </div>
        <div className="flex-grow">
          <img
            className="w-full"
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="hero"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHero; 