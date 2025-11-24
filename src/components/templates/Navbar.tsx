import React from "react";
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
import { usePathname } from "next/navigation";
import i18n from "@/i18n/locales";

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
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      className="bg-gray-800 text-white p-6"
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
          <AcmeLogo />
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
      </NavbarContent>
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
      <NavbarMenu className="pt-6 backdrop-blur-md bg-gray-900/95 shadow-lg">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <NextLink
              className="w-full text-white hover:text-gray-300 transition py-3"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
            >
              {item}
            </NextLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

