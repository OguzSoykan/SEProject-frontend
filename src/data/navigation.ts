import { NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

export const MEGAMENU_TEMPLATES: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Ana Sayfa",
    children: [
      { id: ncNanoId(), href: "/", name: "Ana Sayfa" },
    ],
  },
  {
    id: ncNanoId(),
    href: "/",
    name: "Sayfalar",
    children: [
      { id: ncNanoId(), href: "/cart", name: "Sepetim" },
      { id: ncNanoId(), href: "/account", name: "Hesabım" },
      { id: ncNanoId(), href: "/account-my-order", name: "Siparişlerim" },
    ],
  },
];

const OTHER_PAGE_CHILD: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Ana Sayfa",
  },
  {
    id: ncNanoId(),
    href: "/cart",
    name: "Sepetim",
  },
  {
    id: ncNanoId(),
    href: "/account",
    name: "Hesabım",
  },
  {
    id: ncNanoId(),
    href: "/account-my-order",
    name: "Siparişlerim",
  },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Ana Sayfa",
  },
  {
    id: ncNanoId(),
    href: "/cart",
    name: "Sepetim",
  },
  {
    id: ncNanoId(),
    href: "/account",
    name: "Hesabım",
  },
  {
    id: ncNanoId(),
    href: "/account-my-order",
    name: "Siparişlerim",
  },
];
