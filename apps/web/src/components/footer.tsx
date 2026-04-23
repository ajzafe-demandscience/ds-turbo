import { urlFor } from "@workspace/sanity/client";
import type {
  QueryFooterDataResult,
  QueryGlobalSeoSettingsResult,
} from "@workspace/sanity/types";
import Link from "next/link";

import { RichText } from "./elements/rich-text";
import { FooterNewsletterForm } from "./footer-newsletter-form";
import { Logo } from "./logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";

type SocialLinksProps = {
  data: NonNullable<QueryGlobalSeoSettingsResult>["socialLinks"];
};

type FooterProps = {
  data: NonNullable<QueryFooterDataResult>;
  settingsData: NonNullable<QueryGlobalSeoSettingsResult>;
};

/** Used when the footer singleton is missing in Sanity so we still render a real footer. */
const EMPTY_FOOTER_DOCUMENT = {
  _id: "footer",
  title: "",
  subtitle: null,
  columns: null,
  pageBuilder: null,
} as NonNullable<QueryFooterDataResult>;

/** Settings are optional for the footer UI (logo falls back to default asset in `Logo`). */
const EMPTY_SETTINGS_FOR_FOOTER = {
  _id: "",
  _type: "settings" as const,
  siteTitle: "",
  logo: null,
  siteDescription: "",
  socialLinks: null,
} as NonNullable<QueryGlobalSeoSettingsResult>;

type FooterMegaMenuBlock = Extract<
  NonNullable<NonNullable<QueryFooterDataResult>["pageBuilder"]>[number],
  { _type: "footerMegaMenu" }
>;

type FooterNewsletterBlock = Extract<
  NonNullable<FooterMegaMenuBlock["pageBuilder"]>[number],
  { _type: "footerNewsletter" }
>;

type FooterLinksBlock = Extract<
  NonNullable<FooterMegaMenuBlock["pageBuilder"]>[number],
  { _type: "footerLinks" }
>;

type FooterCopyrightBlock = Extract<
  NonNullable<NonNullable<QueryFooterDataResult>["pageBuilder"]>[number],
  { _type: "footerCopyright" }
>;

type LegacyFooterColumn = {
  _key?: string;
  title?: string | null;
  links?: Array<{
    _key?: string;
    name?: string | null;
    href?: string | null;
    openInNewTab?: boolean | null;
  }> | null;
};

type LegacyFooterLink = NonNullable<LegacyFooterColumn["links"]>[number];

type FooterLogoImageInput = {
  id?: string | null;
  alt?: string | "untitled";
};

function buildFooterLogoSrc(image: FooterLogoImageInput | null | undefined) {
  if (!image?.id) {
    return;
  }
  return urlFor({ ...image, _id: image.id })
    .width(640)
    .fit("max")
    .auto("format")
    .quality(85)
    .url();
}

function footerLogoAlt(
  image: FooterLogoImageInput | null | undefined,
  fallback: string,
) {
  const raw = image?.alt;
  if (typeof raw === "string" && raw.length > 0 && raw !== "untitled") {
    return raw;
  }
  if (fallback.length > 0) {
    return fallback;
  }
  return "Site";
}

function FooterLogoImg({
  image,
  titleFallback,
  centeredOnMobile,
}: {
  image: FooterLogoImageInput | null | undefined;
  titleFallback: string;
  centeredOnMobile?: boolean;
}) {
  const src = buildFooterLogoSrc(image);
  if (!src) {
    return null;
  }

  return (
    <img
      alt={footerLogoAlt(image, titleFallback)}
      className={
        centeredOnMobile
          ? "mx-auto h-auto max-w-full object-contain lg:mx-0"
          : "h-auto max-w-full object-contain object-left"
      }
      decoding="async"
      loading="lazy"
      src={src}
      style={{ filter: "brightness(30)" }}
    />
  );
}

function SocialLinks({ data }: SocialLinksProps) {
  if (!data) {
    return null;
  }

  const { facebook, twitter, instagram, youtube, linkedin } = data;

  const socialLinks = [
    {
      url: instagram,
      Icon: InstagramIcon,
      label: "Follow us on Instagram",
    },
    {
      url: facebook,
      Icon: FacebookIcon,
      label: "Follow us on Facebook",
    },
    { url: twitter, Icon: XIcon, label: "Follow us on Twitter" },
    {
      url: linkedin,
      Icon: LinkedinIcon,
      label: "Follow us on LinkedIn",
    },
    {
      url: youtube,
      Icon: YoutubeIcon,
      label: "Subscribe to our YouTube channel",
    },
  ].filter((link) => link.url);

  return (
    <div className="social-links flex items-center gap-6 text-muted-foreground">
      {socialLinks.map(({ url, Icon, label }, index) => (
        <Link
          aria-label={label}
          className="font-medium hover:text-primary"
          href={url ?? "#"}
          key={`social-link-${url}-${index.toString()}`}
          prefetch={false}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="fill-muted-foreground hover:fill-primary/80 dark:fill-zinc-400 dark:hover:fill-primary" />
          <span className="sr-only">{label}</span>
        </Link>
      ))}
    </div>
  );
}

function MegaMenuSocialLinks({
  data,
}: {
  data: FooterNewsletterBlock["socialLinks"] | undefined;
}) {
  if (!data) {
    return null;
  }

  const socialLinks = [
    {
      url: data.linkedin,
      iconImage:
        (data as {
          linkedinIcon?: FooterLogoImageInput | null;
        }).linkedinIcon ?? null,
      Icon: LinkedinIcon,
      label: "LinkedIn",
    },
    {
      url: data.twitter,
      iconImage:
        (data as {
          twitterIcon?: FooterLogoImageInput | null;
        }).twitterIcon ?? null,
      Icon: XIcon,
      label: "X",
    },
    {
      url: data.facebook,
      iconImage:
        (data as {
          facebookIcon?: FooterLogoImageInput | null;
        }).facebookIcon ?? null,
      Icon: FacebookIcon,
      label: "Facebook",
    },
  ].filter((link) => link.url);

  if (!socialLinks.length) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      {socialLinks.map(({ url, iconImage, Icon, label }) => {
        const uploadedIconSrc = buildFooterLogoSrc(iconImage);
        return (
          <Link
            aria-label={label}
            className="transition-opacity hover:opacity-80"
            href={url ?? "#"}
            key={`${label}-${url}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {uploadedIconSrc ? (
              <img
                alt={`${label} icon`}
                className="h-auto w-auto max-w-none"
                decoding="async"
                loading="lazy"
                src={uploadedIconSrc}
              />
            ) : (
              <Icon className="size-4 fill-[#223465]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

function FooterMegaMenuSection({
  block,
  siteTitle,
}: {
  block: FooterMegaMenuBlock;
  siteTitle?: string | null;
}) {
  const nestedBlocks = block.pageBuilder ?? [];
  const newsletterBlock = nestedBlocks.find(
    (nestedBlock): nestedBlock is FooterNewsletterBlock =>
      nestedBlock?._type === "footerNewsletter",
  );
  const linksBlocks = nestedBlocks.filter(
    (nestedBlock): nestedBlock is FooterLinksBlock =>
      nestedBlock?._type === "footerLinks",
  );

  const columnsPerRow =
    typeof block.columnsPerRow === "number" && Number.isFinite(block.columnsPerRow)
      ? Math.max(1, Math.min(6, Math.round(block.columnsPerRow)))
      : null;

  const columnsContainerClassName = columnsPerRow
    ? "grid gap-6 lg:gap-16"
    : "flex flex-wrap gap-x-10 gap-y-6 lg:gap-x-16";

  return (
    <div className="mx-auto flex max-w-[1550px] flex-col items-start justify-between gap-10 px-6 text-left md:px-6 lg:flex-row">
      <div className="mx-auto flex w-full max-w-[500px] shrink flex-col gap-4 lg:mx-0">
        {newsletterBlock?.logo ? (
          <span className="flex items-center gap-4">
            <FooterLogoImg
              image={newsletterBlock.logo}
              titleFallback={siteTitle ?? ""}
            />
          </span>
        ) : null}
        {newsletterBlock?.description ? (
          <p className="text-white mb-0">
            {newsletterBlock.description}
          </p>
        ) : null}
        {newsletterBlock ? (
          <>
            <FooterNewsletterForm
              buttonLabel={newsletterBlock.buttonLabel}
              inputPlaceholder={newsletterBlock.inputPlaceholder}
            />
            {Array.isArray(newsletterBlock.terms) &&
            newsletterBlock.terms.length > 0 ? (
              <div className="flex items-start gap-2.5 text-[12px] leading-snug text-white">
                <input
                  aria-labelledby={`footer-terms-copy-${newsletterBlock._key}`}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border border-white/55 bg-[#13206e] accent-[#cf2f5b]"
                  id={`footer-terms-cb-${newsletterBlock._key}`}
                  type="checkbox"
                />
                <div
                  className="min-w-0 flex-1 text-[12px] leading-snug"
                  id={`footer-terms-copy-${newsletterBlock._key}`}
                >
                  <RichText
                    className="text-[12px] leading-snug !text-white [&_*]:!text-white [&_p]:my-0 [&_p]:!text-[12px] [&_p]:leading-snug [&_a]:underline prose-p:my-0 prose-p:!text-[12px] prose-p:leading-snug prose-p:!text-white prose-headings:!text-[12px] prose-headings:leading-snug prose-headings:!text-white prose-li:!text-[12px] prose-li:!text-white prose-ol:!text-[12px] prose-ul:!text-[12px] prose-a:!text-[12px] prose-a:!text-white"
                    richText={newsletterBlock.terms}
                  />
                </div>
              </div>
            ) : null}
            <MegaMenuSocialLinks data={newsletterBlock.socialLinks} />
          </>
        ) : null}
      </div>

      {linksBlocks.length ? (
        <div
          className={columnsContainerClassName}
          style={
            columnsPerRow
              ? {
                  gridTemplateColumns: `repeat(${columnsPerRow}, minmax(180px, 1fr))`,
                }
              : undefined
          }
        >
          {linksBlocks.map((column, index) => (
            <div
              className={columnsPerRow ? undefined : "min-w-[160px] flex-1 lg:flex-none"}
              key={`column-${column?._key}-${index}`}
            >
              <h3 className="mb-4 font-bold text-white uppercase">{column?.title}</h3>
              {column?.links?.length ? (
                <ul className="m-0 list-none space-y-3 p-0 text-[18px] leading-normal text-white">
                  {column.links.map((link, columnIndex) => (
                    <li
                      className="list-none"
                      key={`${link?._key}-${columnIndex}-column-${column?._key}`}
                    >
                      <Link
                        className="relative inline-block text-[18px] text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
                        href={link.href ?? "#"}
                        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                        target={link.openInNewTab ? "_blank" : undefined}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FooterCopyrightSection({ block }: { block: FooterCopyrightBlock }) {
  if (!block.copyrightText && !block.links?.length) {
    return null;
  }

  return (
    <div className="pt-5 md:pt-6">
      <div className="mx-auto flex max-w-[1550px] flex-col justify-between gap-3 px-6 text-center font-normal text-[14px] text-white/90 leading-none md:px-6 lg:flex-row lg:items-center lg:gap-6 lg:text-left">
        <p className="whitespace-nowrap text-[14px] text-white/95">
          {block.copyrightText}
        </p>
        {block.links?.length ? (
          <div className="flex flex-wrap justify-center gap-x-0 gap-y-2 lg:justify-start">
            {block.links.map((link, index) => (
              <Link
                className="inline-flex items-center px-1.5 text-[14px] text-white/90 transition-colors hover:text-white"
                href={link.href ?? "#"}
                key={`${link._key ?? "copyright-link"}-${index.toString()}`}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                target={link.openInNewTab ? "_blank" : undefined}
              >
                {index > 0 ? (
                  <span aria-hidden className="mr-1.5 text-white/65">
                    |
                  </span>
                ) : null}
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="footer-skeleton mt-16 pb-8">
      <section className="container mx-auto px-4 md:px-6">
        <div className="h-[500px] lg:h-auto">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <div className="h-[40px] w-[80px] animate-pulse rounded bg-muted" />
                </span>
                <div className="mt-6 h-16 w-full animate-pulse rounded bg-muted" />
              </div>
              <div className="flex items-center space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    className="h-6 w-6 animate-pulse rounded bg-muted"
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {[1, 2, 3].map((col) => (
                <div key={col}>
                  <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        className="h-4 w-full animate-pulse rounded bg-muted"
                        key={item}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center lg:flex-row lg:items-center lg:text-left">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="flex justify-center gap-4 lg:justify-start">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export function Footer({ data, settingsData }: FooterProps) {
  const { pageBuilder } = data;
  const legacyFooterData = data as QueryFooterDataResult & {
    subtitle?: string | null;
    columns?: LegacyFooterColumn[] | null;
  };
  const subtitle = legacyFooterData.subtitle;
  const columns = (legacyFooterData as { columns?: LegacyFooterColumn[] | null })
    .columns;
  const { siteTitle, logo, socialLinks } = settingsData;
  const footerMegaMenuBlock = pageBuilder?.find(
    (block): block is FooterMegaMenuBlock => block?._type === "footerMegaMenu",
  );
  const footerCopyrightBlock = (pageBuilder ?? []).find(
    (block): block is FooterCopyrightBlock => block?._type === "footerCopyright",
  );

  return (
    <footer className="footer mt-20 bg-primary pb-8">
      <section className="container mx-auto">
        <div className="lg:h-auto">
          <div className="py-10 md:py-12 lg:py-20">
            {footerMegaMenuBlock ? (
              <FooterMegaMenuSection block={footerMegaMenuBlock} siteTitle={siteTitle} />
            ) : (
              <div className="mx-auto flex max-w-[1550px] flex-col items-center justify-between gap-10 px-6 text-center md:px-6 lg:flex-row lg:text-left">
                <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 md:gap-8 lg:items-start">
                  <div>
                    <span className="flex items-center justify-center gap-4 lg:justify-start">
                      {buildFooterLogoSrc(logo) ? (
                        <FooterLogoImg
                          centeredOnMobile
                          image={logo}
                          titleFallback={siteTitle ?? ""}
                        />
                      ) : (
                        <Logo alt={siteTitle} image={logo} priority />
                      )}
                    </span>
                    {subtitle ? (
                      <p className="mt-6 text-sm text-white/85">{subtitle}</p>
                    ) : null}
                  </div>
                  {socialLinks && <SocialLinks data={socialLinks} />}
                </div>
                {Array.isArray(columns) && columns.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6 lg:mr-20 lg:gap-28">
                    {columns.map((column, index) => (
                      <div key={`column-${column?._key}-${index}`}>
                        <h3 className="mb-6 font-bold text-white uppercase">{column?.title}</h3>
                        {column?.links?.length ? (
                          <ul className="m-0 list-none space-y-4 p-0 text-[18px] leading-normal text-white">
                            {column.links.map((link: LegacyFooterLink, columnIndex: number) => (
                              <li
                                className="list-none"
                                key={`${link?._key}-${columnIndex}-column-${column?._key}`}
                              >
                                <Link
                                  className="relative inline-block text-[18px] text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
                                  href={link.href ?? "#"}
                                  rel={
                                    link.openInNewTab ? "noopener noreferrer" : undefined
                                  }
                                  target={link.openInNewTab ? "_blank" : undefined}
                                >
                                  {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          {footerCopyrightBlock ? (
            <FooterCopyrightSection block={footerCopyrightBlock} />
          ) : (
            <div className="border-white/20 border-t pt-8">
              <div className="mx-auto flex max-w-[1550px] flex-col justify-between gap-4 px-6 text-center font-normal text-muted-foreground text-sm md:px-6 lg:flex-row lg:items-center lg:text-left">
                <p className="text-white/85">
                  © {new Date().getFullYear()} {siteTitle}. All rights reserved.
                </p>
                <ul className="flex justify-center gap-4 lg:justify-start">
                  <li className="text-white/85 hover:text-white">
                    <Link href="/terms">Terms and Conditions</Link>
                  </li>
                  <li className="text-white/85 hover:text-white">
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </footer>
  );
}
