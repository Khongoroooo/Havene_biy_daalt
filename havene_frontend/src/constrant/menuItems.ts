// src/constants/menuItems.ts

interface MenuItem {
    label: string
    url: string
  }
  
  interface RoleBasedMenus {
    [key: string]: MenuItem[]
  }
  
  export const menuItems: RoleBasedMenus = {
    guest: [
      { label: "НҮҮР", url: "/" },
      { label: "ОФИС", url: "/offices" },
      { label: "АГЕНТУУД", url: "/agents" },
      { label: "ТАНИЛЦУУЛГА", url: "/about" },
      { label: "ХОЛБОО БАРИХ", url: "/contact" },
    ],
    
    agent: [
      { label: "МИНИЙ ЗАРУУД", url: "/my-properties" },
      { label: "ЗАХИАЛГУУД", url: "/bookings" },
      { label: "ПРОФАЙЛ", url: "/profile" },
    ],
    
    user: [
      { label: "НҮҮР", url: "/" },
      { label: "МИНИЙ ЗАРУУД", url: "/my-havene" },
      { label: "ПРОФАЙЛ", url: "/profile" },
    ],
    
    admin: [
      { label: "ХЯНАЛТЫН САМБАР", url: "/admin/dashboard" },
      { label: "ХЭРЭГЛЭГЧИД", url: "/admin/users" },
      { label: "ТОХИРГОО", url: "/admin/settings" },
      { label: "ПРОФАЙЛ", url: "/profile" },
    ],
  }
  