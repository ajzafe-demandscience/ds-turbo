import { sanityFetch } from "@workspace/sanity/live";
import {
  queryFooterData,
  queryGlobalSeoSettings,
} from "@workspace/sanity/query";

export type FooterVariant = "main" | "copyrightOnly";

function variantToFooterTitle(variant: FooterVariant) {
  return variant === "copyrightOnly" ? "Footer Copyright Only" : "Footer Main";
}

export const getFooterData = async (variant: FooterVariant = "main") => {
  const [footerData, settingsData] = await Promise.all([
    sanityFetch({
      query: queryFooterData,
      params: { footerTitle: variantToFooterTitle(variant) },
    }),
    sanityFetch({ query: queryGlobalSeoSettings }),
  ]);

  return { footerData: footerData.data, settingsData: settingsData.data };
};
