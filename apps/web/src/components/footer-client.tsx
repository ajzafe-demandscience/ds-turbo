"use client";

import type {
  QueryFooterDataResult,
  QueryGlobalSeoSettingsResult,
} from "@workspace/sanity/types";
import { usePathname } from "next/navigation";
import useSWR from "swr";

import { Footer } from "./footer";

type FooterApiData = {
  footerData: QueryFooterDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
};

type FooterClientProps = {
  initialFooterData: QueryFooterDataResult;
  initialSettingsData: QueryGlobalSeoSettingsResult;
};

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

const fetcher = async (url: string): Promise<FooterApiData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch footer data");
  }
  return response.json();
};

export function FooterClient({
  initialFooterData,
  initialSettingsData,
}: FooterClientProps) {
  const pathname = usePathname();
  const footerVariant = pathname.startsWith("/demand")
    ? "copyrightOnly"
    : "main";

  const { data } = useSWR<FooterApiData>(
    `/api/footer?variant=${footerVariant}`,
    fetcher,
    {
      fallbackData: {
        footerData: initialFooterData,
        settingsData: initialSettingsData,
      },
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: true,
      refreshInterval: 30_000,
    },
  );

  const footerData =
    data?.footerData ?? initialFooterData ?? EMPTY_FOOTER_DOCUMENT;
  const settingsData =
    data?.settingsData ?? initialSettingsData ?? EMPTY_SETTINGS_FOR_FOOTER;

  return <Footer data={footerData} settingsData={settingsData} />;
}
