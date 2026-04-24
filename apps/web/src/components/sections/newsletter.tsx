import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import {
  FacebookIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/social-icons";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType } from "@/types";

export type NewsletterBlockProps = PagebuilderType<"newsletter"> & {
  isNested?: boolean;
};

export function NewsletterBlock({
  logo,
  description,
  inputPlaceholder,
  buttonLabel,
  terms,
  socialLinks,
  sectionId,
  _type,
  isNested = false,
}: NewsletterBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;
  const hasSocialLinks = Boolean(
    socialLinks?.linkedin || socialLinks?.twitter || socialLinks?.facebook,
  );

  const inner = (
    <div className="max-w-[320px] rounded-2xl border border-white/30 bg-[#13206e] p-5 text-white">
        {logo?.id ? (
          <div className="mb-4">
            <SanityImage
              alt={logo.alt ?? "Newsletter logo"}
              className="h-auto w-auto max-h-9 object-contain"
              image={logo}
            />
          </div>
        ) : null}

        {description ? (
          <p className="text-[27px] leading-[1.25]">{description}</p>
        ) : null}

        <form
          className="mt-4 flex rounded-full bg-white p-1"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-3 py-1.5 text-[#5f5f5f] text-sm outline-none placeholder:text-[#8d8d8d]"
            placeholder={inputPlaceholder || "Enter business email"}
            type="email"
          />
          <button
            className="rounded-full bg-[#cf2f5b] px-5 py-1.5 font-semibold text-sm text-white transition-colors hover:bg-[#bb294f]"
            type="submit"
          >
            {buttonLabel || "Sign Up"}
          </button>
        </form>

        {terms ? (
          <p className="mt-3 text-[11px] leading-[1.35] text-white/80">{terms}</p>
        ) : null}

        {hasSocialLinks ? (
          <div className="mt-3 flex items-center gap-2">
            {socialLinks?.linkedin ? (
              <Link
                aria-label="Visit LinkedIn"
                className="rounded-full bg-white p-1 transition-opacity hover:opacity-80"
                href={socialLinks.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                <LinkedinIcon className="size-4 fill-[#223465]" />
              </Link>
            ) : null}
            {socialLinks?.twitter ? (
              <Link
                aria-label="Visit X"
                className="rounded-full bg-white p-1 transition-opacity hover:opacity-80"
                href={socialLinks.twitter}
                rel="noopener noreferrer"
                target="_blank"
              >
                <XIcon className="size-4 fill-[#223465]" />
              </Link>
            ) : null}
            {socialLinks?.facebook ? (
              <Link
                aria-label="Visit Facebook"
                className="rounded-full bg-white p-1 transition-opacity hover:opacity-80"
                href={socialLinks.facebook}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FacebookIcon className="size-4 fill-[#223465]" />
              </Link>
            ) : null}
          </div>
        ) : null}
    </div>
  );

  return (
    <section
      className={cn(camelCaseToKebabCase(_type), isNested ? "w-full" : undefined)}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : (
        <div className="container-wrapper py-10 md:py-14">{inner}</div>
      )}
    </section>
  );
}
