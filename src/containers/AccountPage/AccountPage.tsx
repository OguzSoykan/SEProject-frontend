import Label from "components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import Input from "shared/Input/Input";
import CommonLayout from "./CommonLayout";
import { Helmet } from "react-helmet-async";

export interface AccountPageProps {
  className?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      setUserData({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        username: parsed.username,
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Account || Ciseco ecommerce React Template</title>
      </Helmet>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Account information
          </h2>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              <div className="relative rounded-full overflow-hidden flex">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
              <div>
                <Label>Full name</Label>
                <Input
                  className="mt-1.5"
                  defaultValue={`${userData.firstName} ${userData.lastName}`}
                  readOnly
                />
              </div>

              <div>
                <Label>Username</Label>
                <Input
                  className="mt-1.5"
                  defaultValue={userData.username}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;
