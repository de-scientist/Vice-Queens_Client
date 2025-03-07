interface SubMenu {
  id: number;
  title: string;
  link: string;
}

interface AdminMenu {
  id: number;
  title: string;
  link: string;
  icon: string;
  subMenus?: SubMenu[];
}

export const adminMenus: AdminMenu[] = [
  {
    id: 1,
    title: "Dashboard",
    link: "/admin",
    icon: "LuLayoutDashboard",
  },
  {
    id: 2,
    title: "Inventory",
    link: "#",
    icon: "LuBox",
    subMenus: [
      { id: 1, title: "Products", link: "/admin/products" },
      { id: 3, title: "Categories", link: "/admin/categories" },
    ],
  },
  {
    id: 5,
    title: "Orders",
    link: "/admin/orders",
    icon: "LuShoppingBag",
  },

  {
    id: 3,
    title: "Settings",
    link: "/admin/settings",
    icon: "LuSettings",
  },
  {
    id: 4,
    title: "Pickup Stations",
    link: "/admin/pickup-stations",
    icon: "LuMapPin",
  },
  {
    id: 6,
    title: "Transactions",
    link: "#",
    icon: "LuCreditCard",
    subMenus: [
      { id: 1, title: "Payment History", link: "/admin/history" },
      { id: 2, title: "Refund Requests", link: "/admin/refunds" },
    ],
  },
  {
    id: 7,
    title: "Profile",
    link: "/admin/profile",
    icon: "LuUserCog",
  },
  {
    id: 8,
    title: "Customer Support",
    link: "#",
    icon: "LuMessageCircle",
    subMenus: [
      { id: 1, title: "Tickets", link: "/admin/tickets" },
      { id: 2, title: "FAQs", link: "/admin/faqs" },
    ],
  },
  {
    id: 9,
    title: "Edit Content",
    link: "#",
    icon: "LuFilePen",
    subMenus: [
      { id: 1, title: "Blogs", link: "/admin/blogs" },
      { id: 2, title: "Pages", link: "/admin/pages" },
    ],
  },
  {
    id: 10,
    title: "Analytics",
    link: "#",
    icon: "LuChartColumn",
    subMenus: [
      { id: 1, title: "Sales Reports", link: "/admin/sales" },
      { id: 2, title: "User Activity", link: "/admin/users" },
    ],
  },
  {
    id: 11,
    title: "Marketing",
    link: "#",
    icon: "LuMegaphone",
    subMenus: [
      { id: 1, title: "Campaigns", link: "/admin/campaigns" },
      { id: 2, title: "Promotions", link: "/admin/promotions" },
    ],
  },
];
