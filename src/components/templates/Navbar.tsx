import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import NextLink from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import LogoutButton from "../organisms/LogoutButton";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import CartView from "../CartView";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavbarTemplate() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showCart, setShowCart] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // const menuItems = [
  //   "Profile",
  //   "Dashboard",
  //   "Activity",
  //   "Analytics",
  //   "System",
  //   "Deployments",
  //   "My Settings",
  //   "Team Settings",
  //   "Help & Feedback",
  //   "Log Out",
  // ];

  return (
    <Navbar
      className="bg-gray-800 text-white p-2 pt-6 pb-6"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <button
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white focus:outline-none p-2 hover:bg-gray-700 rounded-md transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <NavbarBrand>
          
          <p className="font-bold text-inherit">PLANTAS BONITAS</p>
        </NavbarBrand>
      </NavbarContent>

      {session?.user && (
        <>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NextLink href="/dashboard">
            Dashboard
          </NextLink>
        </NavbarItem>
        <NavbarItem isActive>
          <NextLink href="/dashboard/products">
            Products
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/dashboard/products/create" className="text-foreground">
            Create Products
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <button
            onClick={() => router.push("/dashboard/cart")}
            className="bg-green-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-500 transition"
          >
            Ver carrito
          </button>
        </NavbarItem>
      </NavbarContent>
      {showCart && (
        <div style={{ minWidth: 250, background: "#fff", color: "#222", borderRadius: 8, padding: 8, position: "absolute", right: 20, top: 60, zIndex: 50 }}>
          <CartView />
        </div>
      )}
        </>
      )}
      <NavbarContent justify="end">
        <NavbarItem className="flex gap-4">

          {session?.user && (
            <>
            <LogoutButton />
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
              className="bg-[#000000] hover:bg-[#47883f] text-white px-4 py-2 rounded-md transition"
            >
              {i18n.language === "es" ? "EN" : "ES"}
            </button>
            </>
          )}

          {pathname === "/auth/login" && (
            <><NextLink href={"/auth/register"} >Register</NextLink></>
          )}

          {pathname === "/auth/register" && (
            <><NextLink href={"/auth/login"} >Login</NextLink></>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu 
        className="pt-6 bg-gray-900 text-white"
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          backgroundColor: '#111827',
          zIndex: 40,
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}
      >
        {session?.user && (
          <>
            <NavbarMenuItem className="border-b border-gray-700">
              <NextLink
                className="w-full text-white hover:text-green-400 transition py-4 block text-lg font-medium px-4"
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NextLink>
            </NavbarMenuItem>
            
            <NavbarMenuItem className="border-b border-gray-700">
              <NextLink
                className="w-full text-white hover:text-green-400 transition py-4 block text-lg font-medium px-4"
                href="/dashboard/products"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </NextLink>
            </NavbarMenuItem>
            
            <NavbarMenuItem className="border-b border-gray-700">
              <NextLink
                className="w-full text-white hover:text-green-400 transition py-4 block text-lg font-medium px-4"
                href="/dashboard/products/create"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Products
              </NextLink>
            </NavbarMenuItem>
            
            <NavbarMenuItem className="border-b border-gray-700">
              <button
                onClick={() => {router.push("/dashboard/cart");setIsMenuOpen(false) }}
                className="w-full text-left text-white hover:text-green-400 transition py-4 block text-lg font-medium px-4"
              >
                Ver carrito
              </button>
            </NavbarMenuItem>
            
            <NavbarMenuItem className="px-4 py-4">
              <LogoutButton />
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}

