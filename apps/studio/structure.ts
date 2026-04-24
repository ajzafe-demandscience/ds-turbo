import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  HomeIcon,
  type LucideIcon,
  MessageCircle,
  PanelBottomIcon,
  PanelTop,
  Settings2,
  Tag,
  TrendingUpDown,
  User,
  Video,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "@/schemaTypes/index";
import { getTitleCase } from "@/utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
  extraItems?: Array<ReturnType<StructureBuilder["listItem"]>>;
};

const createIndexListWithOrderableItems = ({
  S,
  index,
  list,
  context,
  extraItems = [],
}: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type)
            ),
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            icon: list.icon ?? File,
            title: `${listTitle}`,
          }),
          ...extraItems,
        ])
    );
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      createList({ S, type: "page", title: "Pages", icon: FileText }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", title: "Blogs", icon: FileText },
        context,
        extraItems: [
          S.documentTypeListItem("category")
            .id("category")
            .title("Categories")
            .icon(Tag),
        ],
      }),
      orderableDocumentListDeskItem({
        type: "webinar",
        S,
        context,
        icon: Video,
        title: "Webinars",
      }),
      createList({
        S,
        type: "pressRelease",
        title: "Press Releases",
        icon: FileText,
      }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "landingPageIndex", icon: File },
        list: { type: "landingPage", title: "Landing Pages", icon: FileText },
        context,
      }),
      createSingleTon({
        S,
        type: "companyLogoCarouselConfig",
        title: "Company Logo Carousel",
        icon: File,
      }),
      createList({
        S,
        type: "faq",
        title: "FAQs",
        icon: MessageCircle,
      }),
      createList({ S, type: "author", title: "Authors", icon: User }),
      createList({
        S,
        type: "redirect",
        title: "Redirects",
        icon: TrendingUpDown,
      }),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createList({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createList({
                S,
                type: "navbar",
                title: "Navigation",
                icon: PanelTop,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
                icon: CogIcon,
              }),
            ])
        ),
    ]);
