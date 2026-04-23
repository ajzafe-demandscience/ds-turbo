import { sanityFetch } from "@workspace/sanity/live";
import {
  queryGlobalSeoSettings,
  queryNavbarData,
} from "@workspace/sanity/query";

export type NavigationVariant = "main" | "logoOnly";

function variantToNavigationLabel(variant: NavigationVariant) {
  return variant === "logoOnly"
    ? "Navbar Logo Only"
    : "Navbar Main";
}

export const getNavigationData = async (variant: NavigationVariant = "main") => {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({
      query: queryNavbarData,
      params: { navigationLabel: variantToNavigationLabel(variant) },
    }),
    sanityFetch({ query: queryGlobalSeoSettings }),
  ]);

  return { navbarData: navbarData.data, settingsData: settingsData.data };
};
