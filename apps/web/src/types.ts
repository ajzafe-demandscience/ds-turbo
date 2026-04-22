import type { FilterByType, Get } from "@sanity/codegen";
import type {
  QueryBlogIndexPageBlogsResult,
  QueryBlogSlugPageDataResult,
  QueryGlobalSeoSettingsResult,
  QueryHomePageDataResult,
  QueryImageTypeResult,
  QueryNavbarDataResult,
} from "@workspace/sanity/types";

export type PageBuilderBlock = Get<
  QueryHomePageDataResult,
  "pageBuilder",
  number
>;

export type PageBuilderBlockTypes = NonNullable<PageBuilderBlock>["_type"];

export type PagebuilderType<T extends PageBuilderBlockTypes> = FilterByType<
  NonNullable<PageBuilderBlock>,
  T
>;

export type SanityButtonProps = Get<QueryNavbarDataResult, "buttons", number>;

export type SanityImageProps = NonNullable<QueryImageTypeResult>;

export type SanityRichTextProps = Get<QueryBlogSlugPageDataResult, "richText">;

export type SanityRichTextBlock = FilterByType<
  NonNullable<NonNullable<SanityRichTextProps>[number]>,
  "block"
>;

export type Blog = Get<QueryBlogIndexPageBlogsResult, number>;

export type Maybe<T> = T | null | undefined;

// Navigation types
export type NavigationData = {
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
};

export type NavMenuItem = Get<QueryNavbarDataResult, "menuItems", number>;

export type SolutionsFeaturedLink =
  Extract<NavMenuItem, { type: "solutionsMegaMenu" }>["featuredItems"] extends
    Array<infer T>
    ? T
    : never;

export type SolutionsCategoryGroup =
  Extract<NavMenuItem, { type: "solutionsMegaMenu" }>["categoryGroups"] extends
    Array<infer T>
    ? T
    : never;

export type SolutionsCategoryLink =
  SolutionsCategoryGroup["links"] extends Array<infer T> ? T : never;

export type GridMegaMenuCard =
  Extract<NavMenuItem, { type: "gridMegaMenu" }>["cards"] extends Array<infer T>
    ? T
    : never;

export type MenuLinkProps = {
  name: string;
  href: string;
  description?: string;
  icon?: string | null;
  onClick?: () => void;
  showTitleArrow?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  linkClassName?: string;
};
