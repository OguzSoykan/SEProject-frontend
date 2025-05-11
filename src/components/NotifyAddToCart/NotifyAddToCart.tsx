import { Transition } from "@headlessui/react";
import Prices from "components/Prices";
import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";

interface Props {
  show: boolean;
  productImage: string;
  productName: string;
  onClose: () => void;
}

const NotifyAddToCart: FC<Props> = ({
  show,
  productImage,
  productName,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 saniye sonra kapanacak

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-medium">{productName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Added to cart
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500"
                onClick={onClose}
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Transition
        appear
        show={show}
        className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
        enter="transition-all duration-150"
        enterFrom="opacity-0 translate-y-20"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-20"
      >
        <p className="block text-base font-semibold leading-none">
          Added to cart!
        </p>
        <hr className="border-slate-200 dark:border-slate-700 my-4" />
        {renderProductCartOnNotify()}
      </Transition>
    </div>
  );
};

export default NotifyAddToCart; 