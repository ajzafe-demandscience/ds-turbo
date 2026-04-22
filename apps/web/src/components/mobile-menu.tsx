"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type {
  GridMegaMenuCard,
  NavigationData,
  SolutionsCategoryLink,
  SolutionsFeaturedLink,
} from "@/types";
import { MenuLink } from "./elements/menu-link";
import { SanityButtons } from "./elements/sanity-buttons";
import { Logo } from "./logo";

export function MobileMenu({ navbarData, settingsData }: NavigationData) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  const { menuItems, buttons } = navbarData || {};
  const { logo: settingsLogo, siteTitle } = settingsData || {};
  const navbarLogo = (navbarData as { logo?: typeof settingsLogo })?.logo;
  const logo = navbarLogo || settingsLogo;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm flex flex-col px-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center px-6 justify-between pb-4 border-b">
          {logo ? (
            <div className="[&_img]:w-auto [&_img]:h-6 [&_img]:rounded-none">
              <Logo alt={siteTitle || ""} image={logo} />
            </div>
          ) : (
            <SheetTitle>{siteTitle || "Menu"}</SheetTitle>
          )}
          <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        {/* Navigation items - scrollable */}
        <nav className="flex-1 overflow-y-auto pt-4 grid px-6 gap-1 content-start">
          <Accordion type="single" collapsible>
            {menuItems?.map((item) => {
              if (item.type === "link") {
                if (!item.href) return null;
                return (
                  <Link
                    className="flex items-center py-3 font-medium text-sm transition-colors hover:text-primary"
                    href={item.href}
                    key={item._key}
                    onClick={closeMenu}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    target={item.openInNewTab ? "_blank" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item.type === "solutionsMegaMenu") {
                return (
                  <AccordionItem key={item._key} value={item._key} className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 border-border border-l-2 pl-4 ml-1">
                        <div className="grid gap-1">
                          {item.featuredItems?.map(
                            (link: SolutionsFeaturedLink) => (
                              <MenuLink
                                description={link.description || ""}
                                href={link.href || ""}
                                icon={link.icon}
                                key={link._key}
                                name={link.name || ""}
                                onClick={closeMenu}
                              />
                            )
                          )}
                        </div>
                        {item.categoryGroups?.map((group) => (
                          <section key={group._key}>
                            <p className="mb-1 font-semibold text-xs uppercase tracking-wide">
                              {group.title}
                            </p>
                            <div className="grid gap-1">
                              {group.links?.map((link: SolutionsCategoryLink) => (
                                <MenuLink
                                  description={link.description || ""}
                                  href={link.href || ""}
                                  icon={link.icon}
                                  key={link._key}
                                  name={link.name || ""}
                                  onClick={closeMenu}
                                />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              if (item.type === "gridMegaMenu") {
                return (
                  <AccordionItem key={item._key} value={item._key} className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2 border-border border-l-2 pl-4 ml-1">
                        {item.cards?.map((card: GridMegaMenuCard) => (
                          <Link
                            className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                            href={card.href || "#"}
                            key={card._key}
                            onClick={closeMenu}
                            rel={card.openInNewTab ? "noopener noreferrer" : undefined}
                            target={card.openInNewTab ? "_blank" : undefined}
                          >
                            <p className="font-semibold text-sm">{card.title}</p>
                            <p className="text-muted-foreground text-xs">
                              {card.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return null;
            })}
          </Accordion>
        </nav>

        {buttons?.length && (
          <SheetFooter className="border-t">
            <SanityButtons
              buttonClassName="w-full justify-center"
              buttons={buttons || []}
              className="grid gap-3"
            />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
