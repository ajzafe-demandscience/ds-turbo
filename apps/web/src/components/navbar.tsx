"use client";

import { env } from "@workspace/env/client";
import { SANITY_BASE_URL } from "@workspace/sanity/image";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import type {
  GridMegaMenuCard,
  MobileMenuProps,
  NavMenuItem,
  NavigationData,
  SolutionsCategoryLink,
  SolutionsFeaturedLink,
} from "@/types";
import { MenuLink } from "./elements/menu-link";
import { SanityImage } from "./elements/sanity-image";
import { SanityIcon } from "./elements/sanity-icon";
import { SanityButtons } from "./elements/sanity-buttons";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const HOME_NAVBAR_GRADIENT =
  "linear-gradient(98deg, #3C13A5 1.95%, #181776 21.81%, #121970 75.49%, #0F399C 100%)";

const desktopMainNavTriggerClass = {
  base: "relative flex h-16 cursor-pointer items-center gap-1 px-3 text-[18px] transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100",
  home: "text-white hover:text-white/90 after:bg-white",
  default: "text-[#403f3f] hover:text-foreground after:bg-[rgb(64,63,63)]",
} as const;

const desktopNavLinkClass = {
  base: "relative flex h-16 cursor-pointer items-center px-3 font-medium text-[18px] transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100",
  home: "text-white hover:text-white/90 after:bg-white",
  default: "text-[#403f3f] hover:text-foreground after:bg-[rgb(64,63,63)]",
} as const;

function desktopMegaTriggerCn(isHomePage: boolean) {
  return cn(
    desktopMainNavTriggerClass.base,
    isHomePage ? desktopMainNavTriggerClass.home : desktopMainNavTriggerClass.default,
  );
}

function desktopMegaButtonCn(isHomePage: boolean) {
  return cn(
    "relative flex h-16 items-center gap-1 px-3 text-[18px] transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100",
    isHomePage ? desktopMainNavTriggerClass.home : desktopMainNavTriggerClass.default,
  );
}

function desktopSimpleLinkCn(isHomePage: boolean) {
  return cn(
    desktopNavLinkClass.base,
    isHomePage ? desktopNavLinkClass.home : desktopNavLinkClass.default,
  );
}

// Fetcher function
const fetcher = async (url: string): Promise<NavigationData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch navigation data");
  }
  return response.json();
};

function resolveSanityImageSrc(imageId: string): string | null {
  if (!imageId.startsWith("image-")) {
    return null;
  }

  const parts = imageId.split("-");
  if (parts.length < 3) {
    return null;
  }

  const extension = parts.at(-1);
  if (!extension) {
    return null;
  }

  const assetPath = `${parts.slice(1, -1).join("-")}.${extension}`;
  return `${SANITY_BASE_URL}${assetPath}?auto=format`;
}

function DesktopSolutionsMegaMenu({
  item,
  isHomePage,
}: {
  item: Extract<NavMenuItem, { type: "solutionsMegaMenu" }>;
  isHomePage: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rightPanelLabel = (item as { rightPanelLabel?: string }).rightPanelLabel;
  const categoryGroups = item.categoryGroups || [];
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(
    categoryGroups[0]?._key || null
  );

  useEffect(() => {
    if (!categoryGroups.length) {
      setActiveGroupKey(null);
      return;
    }

    const hasActiveGroup = categoryGroups.some(
      (group) => group._key === activeGroupKey
    );

    if (!hasActiveGroup) {
      setActiveGroupKey(categoryGroups[0]?._key || null);
    }
  }, [categoryGroups, activeGroupKey]);

  const activeGroup =
    categoryGroups.find((group) => group._key === activeGroupKey) ||
    categoryGroups[0];
  const activeGroupDescription = (
    activeGroup as { description?: string } | undefined
  )?.description;
  const activeGroupHref = (activeGroup as { href?: string } | undefined)?.href;
  const activeGroupOpenInNewTab = (
    activeGroup as { openInNewTab?: boolean } | undefined
  )?.openInNewTab;
  const topMenuHref = (item as { href?: string } | undefined)?.href;
  const topMenuOpenInNewTab = (
    item as { openInNewTab?: boolean } | undefined
  )?.openInNewTab;

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="group relative">
      {topMenuHref ? (
        <Link
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={desktopMegaTriggerCn(isHomePage)}
          href={topMenuHref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          rel={topMenuOpenInNewTab ? "noopener noreferrer" : undefined}
          target={topMenuOpenInNewTab ? "_blank" : undefined}
        >
          {item.label}
          <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
        </Link>
      ) : (
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={desktopMegaButtonCn(isHomePage)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type="button"
        >
          {item.label}
          <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
        </button>
      )}
      {isOpen ? (
        <div
          className="fade-in-0 zoom-in-95 absolute top-full left-0 z-50 w-[760px] animate-in overflow-hidden rounded-xl border border-[#05195f] bg-[#05195f] shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="menu"
        >
          <div className="grid md:grid-cols-[260px_1fr]">
            <div className="space-y-2 bg-[#05195f] px-4 py-4 text-primary-foreground">
              {item.featuredItems?.map((feature: SolutionsFeaturedLink) => (
                <MenuLink
                  description={feature.description || ""}
                  descriptionClassName="line-clamp-none whitespace-normal break-words !text-[13px] !text-white group-hover/menu-item:!text-white"
                  href={feature.href || ""}
                  icon={feature.icon}
                  key={feature._key}
                  linkClassName="rounded-none border-white/80 border-b hover:bg-transparent last:border-b-0"
                  name={feature.name || ""}
                  showTitleArrow
                  titleClassName="mb-2 !text-[1.125rem] !text-white transition-colors duration-200 group-hover/menu-item:!text-[#d52c5a]"
                />
              ))}
            </div>
            <div className="rounded-r-xl bg-white px-5 py-5 text-slate-900">
              {rightPanelLabel ? (
                <h3 className="mb-5 px-2 font-semibold text-[0.95rem] uppercase tracking-wide text-slate-400">
                  {rightPanelLabel}
                </h3>
              ) : null}
              <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                <div className="border-slate-200 md:border-r md:pr-5">
                  <div className="space-y-1">
                    {categoryGroups.map((group) => {
                      const groupIcon = group.links?.[0]?.icon;
                      const groupIconImage = (group as { iconImage?: unknown })
                        .iconImage;
                      const groupIconImageId = (
                        groupIconImage as { id?: string } | undefined
                      )?.id;
                      const groupIconImageSrc = groupIconImageId
                        ? resolveSanityImageSrc(groupIconImageId)
                        : null;
                      const isActive = group._key === activeGroup?._key;

                      return (
                        <button
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                            isActive
                              ? "bg-[#ecf2ff] text-[#1d4ed8]"
                              : "text-slate-800 hover:bg-slate-100"
                          }`}
                          key={group._key}
                          onMouseEnter={() => setActiveGroupKey(group._key)}
                          onFocus={() => setActiveGroupKey(group._key)}
                          type="button"
                        >
                          <span className="flex items-center gap-2 font-bold text-[18px]">
                            {groupIconImage ? (
                              <img
                                alt={group.title || ""}
                                className="shrink-0 object-contain"
                                decoding="async"
                                height={35}
                                loading="lazy"
                                src={groupIconImageSrc || undefined}
                                width={35}
                              />
                            ) : groupIcon ? (
                              <SanityIcon
                                className="size-5 shrink-0"
                                icon={groupIcon}
                              />
                            ) : null}
                            {group.title}
                          </span>
                          {isActive ? (
                            <ChevronRight className="size-4 shrink-0" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6 pl-1">
                  {activeGroup ? (
                    <>
                      {activeGroupHref ? (
                        <Link
                          className="block rounded-2xl bg-[#ecf2ff] p-6 transition-colors duration-200 hover:bg-[#e4efff]"
                          href={activeGroupHref}
                          rel={
                            activeGroupOpenInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          target={activeGroupOpenInNewTab ? "_blank" : undefined}
                        >
                          <h5 className="font-semibold text-slate-900 leading-tight">
                            {activeGroup.title}
                          </h5>
                          {activeGroupDescription ? (
                            <p className="mt-3 max-w-[24ch] text-slate-700 leading-[1.3]">
                              {activeGroupDescription}
                            </p>
                          ) : null}
                        </Link>
                      ) : (
                        <div className="rounded-2xl bg-[#ecf2ff] p-6">
                          <h5 className="font-semibold text-slate-900 leading-tight">
                            {activeGroup.title}
                          </h5>
                          {activeGroupDescription ? (
                            <p className="mt-3 max-w-[24ch] text-slate-700 leading-[1.3]">
                              {activeGroupDescription}
                            </p>
                          ) : null}
                        </div>
                      )}
                      <div className="grid gap-3">
                        {activeGroup.links?.map((link: SolutionsCategoryLink) => (
                          <Link
                            className="rounded-[8px] bg-transparent px-6 py-3 font-semibold text-[#0b2a88] text-[16px] leading-tight transition-colors duration-200 hover:bg-[#f4f8ff] hover:text-[#1d4ed8]"
                            href={link.href || ""}
                            key={link._key}
                            rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                            target={link.openInNewTab ? "_blank" : undefined}
                          >
                            <span className="flex items-center gap-2">
                              {(link as { iconImage?: unknown }).iconImage ? (
                                <SanityImage
                                  alt={link.name || ""}
                                  className="size-7 shrink-0 object-contain"
                                  height={28}
                                  image={
                                    (link as { iconImage?: unknown })
                                      .iconImage as never
                                  }
                                  width={28}
                                />
                              ) : null}
                              <span>{link.name}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DesktopGridMegaMenu({
  item,
  isHomePage,
}: {
  item: Extract<NavMenuItem, { type: "gridMegaMenu" }>;
  isHomePage: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const topMenuHref = (item as { href?: string } | undefined)?.href;
  const topMenuOpenInNewTab = (
    item as { openInNewTab?: boolean } | undefined
  )?.openInNewTab;

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="group relative">
      {topMenuHref ? (
        <Link
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={desktopMegaTriggerCn(isHomePage)}
          href={topMenuHref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          rel={topMenuOpenInNewTab ? "noopener noreferrer" : undefined}
          target={topMenuOpenInNewTab ? "_blank" : undefined}
        >
          {item.label}
          <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
        </Link>
      ) : (
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={desktopMegaButtonCn(isHomePage)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type="button"
        >
          {item.label}
          <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
        </button>
      )}
      {isOpen ? (
        <div
          className="fade-in-0 zoom-in-95 absolute top-full left-1/2 z-50 w-[980px] -translate-x-1/2 animate-in rounded-xl border bg-popover p-5 shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="menu"
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${item.columns || 3}, minmax(0, 1fr))`,
            }}
          >
            {item.cards?.map((card: GridMegaMenuCard) => (
              <Link
                className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
                href={card.href || "#"}
                key={card._key}
              >
                <p className="font-semibold text-foreground text-lg">
                  {card.title}
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DesktopNavLink({
  item,
  isHomePage,
}: {
  item: Extract<NavMenuItem, { type: "link" }>;
  isHomePage: boolean;
}) {
  if (!item.href) return null;

  return (
    <Link
      className={desktopSimpleLinkCn(isHomePage)}
      href={item.href}
      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
      target={item.openInNewTab ? "_blank" : undefined}
    >
      {item.name}
    </Link>
  );
}

function NavbarSkeleton({ isHomePage = false }: { isHomePage?: boolean }) {
  return (
    <header
      className={cn(
        "navbar-skeleton fixed top-0 z-[1000] w-full border-b",
        isHomePage
          ? "border-transparent"
          : "border-border backdrop-blur-sm bg-white",
      )}
      style={
        isHomePage ? { background: HOME_NAVBAR_GRADIENT } : undefined
      }
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo skeleton - matches Logo component dimensions: width={120} height={40} */}
          {/* <div className="flex items-center">
            <div className="h-10 w-[120px] rounded bg-muted/50 animate-pulse" />
          </div> */}
          <div className="flex h-10 w-40 items-center">
            <div className="h-10 w-40 animate-pulse rounded bg-muted/50" />
          </div>

          {/* Desktop nav skeleton - matches nav gap-1 and px-3 py-2 buttons */}
          {/* <nav className="hidden md:flex items-center gap-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`nav-${i}`}
                className="h-9 px-3 py-2 rounded bg-muted/50 animate-pulse min-w-[60px]"
              />
            ))}
          </nav> */}

          {/* Desktop actions skeleton - matches gap-4 + SanityButtons */}
          {/* <div className="hidden md:flex items-center gap-4">
            <div className="h-9 w-9 rounded bg-muted/50 animate-pulse" />
            <div className="h-9 px-4 rounded-lg bg-muted/50 animate-pulse min-w-[80px]" />
          </div> */}

          {/* Mobile menu button skeleton - matches Button size="icon" */}
          <div className="h-10 w-10 animate-pulse rounded bg-muted/50 md:hidden" />
        </div>
      </div>
    </header>
  );
}

export function Navbar({
  navbarData: initialNavbarData,
  settingsData: initialSettingsData,
}: NavigationData) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isCurrentlyAtTop = currentScrollY <= 0;
      setIsAtTop(isCurrentlyAtTop);

      if (isCurrentlyAtTop) {
        setIsNavbarVisible(true);
        lastScrollYRef.current = 0;
        return;
      }

      const threshold = 4;
      if (currentScrollY > lastScrollYRef.current + threshold) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollYRef.current - threshold) {
        setIsNavbarVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { data, error, isLoading } = useSWR<NavigationData>(
    "/api/navigation",
    fetcher,
    {
      fallbackData: {
        navbarData: initialNavbarData,
        settingsData: initialSettingsData,
      },
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: true,
      refreshInterval: 30_000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const navigationData = data || {
    navbarData: initialNavbarData,
    settingsData: initialSettingsData,
  };
  const { navbarData, settingsData } = navigationData;
  const { menuItems, buttons } = navbarData || {};
  const { logo: settingsLogo, siteTitle } = settingsData || {};
  const navbarLogo = (navbarData as { logo?: typeof settingsLogo })?.logo;
  const logo = navbarLogo || settingsLogo;

  const mobileMenuProps = {
    isHomePage,
    navbarData,
    settingsData,
  } satisfies MobileMenuProps;

  // Show skeleton only on initial mount when no fallback data is available
  if (isLoading && !data && !(initialNavbarData && initialSettingsData)) {
    return <NavbarSkeleton isHomePage={isHomePage} />;
  }

  return (
    <header
      className={cn(
        "navbar fixed top-0 z-[1000] w-full border-b transition-[transform,border-color] duration-300",
        isNavbarVisible ? "translate-y-0" : "-translate-y-full",
        isHomePage
          ? "border-transparent"
          : "border-border backdrop-blur-sm bg-white",
      )}
    >
      {isHomePage ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            isAtTop ? "opacity-0" : "opacity-100",
          )}
          style={{ background: HOME_NAVBAR_GRADIENT }}
        />
      ) : null}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center"
            style={isHomePage ? { filter: "brightness(30)" } : undefined}
          >
            {logo && (
              <Logo
                alt={siteTitle || ""}
                height={40}
                image={logo}
                priority
                width={120}
              />
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {menuItems?.map((item) => {
              if (item.type === "solutionsMegaMenu") {
                return (
                  <DesktopSolutionsMegaMenu
                    isHomePage={isHomePage}
                    item={item}
                    key={item._key}
                  />
                );
              }
              if (item.type === "gridMegaMenu") {
                return (
                  <DesktopGridMegaMenu
                    isHomePage={isHomePage}
                    item={item}
                    key={item._key}
                  />
                );
              }
              if (item.type === "link") {
                return (
                  <DesktopNavLink
                    isHomePage={isHomePage}
                    item={item}
                    key={item._key}
                  />
                );
              }
              return null;
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <SanityButtons
              buttonClassName="rounded-lg"
              buttons={buttons || []}
              className="flex items-center gap-2"
            />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <MobileMenu {...mobileMenuProps} />
          </div>
        </div>
      </div>

      {/* Error boundary for SWR */}
      {error && env.NODE_ENV === "development" && (
        <div className="relative z-10 border-destructive/20 border-b bg-destructive/10 px-4 py-2 text-destructive text-xs">
          Navigation data fetch error: {error.message}
        </div>
      )}
    </header>
  );
}
