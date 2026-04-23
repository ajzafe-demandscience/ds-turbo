import type {
  QueryFooterDataResult,
  QueryGlobalSeoSettingsResult,
} from "@workspace/sanity/types";

import { getFooterData } from "@/lib/footer";
import { FooterClient } from "./footer-client";

const EMPTY_FOOTER_DOCUMENT = {
  _id: "footer",
  title: "",
  subtitle: null,
  columns: null,
  pageBuilder: null,
} as NonNullable<QueryFooterDataResult>;

const EMPTY_SETTINGS_FOR_FOOTER = {
  _id: "",
  _type: "settings" as const,
  siteTitle: "",
  logo: null,
  siteDescription: "",
  socialLinks: null,
} as NonNullable<QueryGlobalSeoSettingsResult>;

export async function FooterServer() {
  const data = await getFooterData("main");

  return (
    <FooterClient
      initialFooterData={data.footerData ?? EMPTY_FOOTER_DOCUMENT}
      initialSettingsData={data.settingsData ?? EMPTY_SETTINGS_FOR_FOOTER}
    />
  );
}
