"use client";

import { cn } from "@workspace/ui/lib/utils";

import { SanityImage } from "@/components/elements/sanity-image";
import { usePageBuilderBlockRoot } from "@/components/page-builder-block-root-context";
import { camelCaseToKebabCase } from "@/lib/camel-case-to-kebab-case";
import type { PagebuilderType, SanityImageProps } from "@/types";

type SpeakersBlockProps = PagebuilderType<"speakers"> & {
  isNested?: boolean;
};

type SpeakerItem = {
  _key: string;
  photo?: SanityImageProps | null;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  bio?: string | null;
};

function SpeakerAvatar({
  photo,
  name,
}: {
  photo?: SanityImageProps | null;
  name: string;
}) {
  return photo?.id ? (
    <div className="h-24 w-24 overflow-hidden rounded-full bg-muted md:h-28 md:w-28">
      <SanityImage
        alt={photo.alt ?? name}
        className="h-full w-full object-cover"
        image={photo}
      />
    </div>
  ) : (
    <div className="h-24 w-24 rounded-full bg-[#cfcfcf] md:h-28 md:w-28" />
  );
}

export function SpeakersBlock({
  eyebrow,
  title,
  description,
  partnersLabel,
  partners,
  speakers,
  sectionId,
  _type,
  isNested = false,
}: SpeakersBlockProps) {
  const { dataSanity, surfaceStyle } = usePageBuilderBlockRoot();
  const resolvedSectionId = sectionId?.trim() || undefined;

  const resolvedTitle = title?.trim();
  const resolvedEyebrow = eyebrow?.trim();
  const resolvedDescription = description?.trim();
  const resolvedPartnersLabel = partnersLabel?.trim();
  const resolvedPartners = Array.isArray(partners)
    ? partners.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean)
    : [];

  const resolvedSpeakers: SpeakerItem[] = Array.isArray(speakers)
    ? (speakers as SpeakerItem[])
        .map((s) => ({
          _key: s._key,
          photo: s.photo ?? null,
          name: s.name ?? null,
          role: s.role ?? null,
          company: s.company ?? null,
          bio: s.bio ?? null,
        }))
        .filter((s) => Boolean(s.name?.trim()))
    : [];

  if (!resolvedTitle && !resolvedSpeakers.length) {
    return null;
  }

  const inner = (
    <div className="mx-auto w-full max-w-5xl">
      <header className="text-left">
        {resolvedEyebrow ? (
          <p className="font-semibold text-[#0066FC] text-xs uppercase tracking-[0.14em]">
            {resolvedEyebrow}
          </p>
        ) : null}

        {resolvedTitle ? (
          <h2 className="mt-3 font-semibold text-3xl tracking-tight md:text-5xl">
            {resolvedTitle}
          </h2>
        ) : null}

        {resolvedDescription ? (
          <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-7 md:text-lg">
            {resolvedDescription}
          </p>
        ) : null}

        {resolvedPartners.length ? (
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground/70">
              {resolvedPartnersLabel || "Partners:"}
            </span>{" "}
            {resolvedPartners.join(" · ")}
          </p>
        ) : null}
      </header>

      {resolvedSpeakers.length ? (
        <div className="mt-10 space-y-10 md:mt-12">
          {resolvedSpeakers.map((speaker) => {
            const name = speaker.name?.trim() ?? "";
            const roleLine = [speaker.role?.trim(), speaker.company?.trim()]
              .filter(Boolean)
              .join(", ");
            const bio = speaker.bio?.trim();

            return (
              <article
                className="grid grid-cols-[96px_1fr] gap-6 md:grid-cols-[112px_1fr] md:gap-8"
                key={speaker._key}
              >
                <SpeakerAvatar name={name} photo={speaker.photo} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0B1D66] text-xl leading-snug md:text-2xl">
                    {name}
                  </h3>
                  {roleLine ? (
                    <p className="mt-1 text-sm text-foreground/80">{roleLine}</p>
                  ) : null}
                  {bio ? (
                    <p className="mt-2 text-sm text-muted-foreground leading-6 md:text-base md:leading-7">
                      {bio}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  return (
    <section
      className={cn(camelCaseToKebabCase(_type))}
      data-sanity={dataSanity}
      id={resolvedSectionId}
      style={surfaceStyle}
    >
      {isNested ? inner : <div className="container-wrapper py-10 md:py-14">{inner}</div>}
    </section>
  );
}

