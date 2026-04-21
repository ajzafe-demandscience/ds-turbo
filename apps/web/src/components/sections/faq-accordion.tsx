import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { FaqJsonLd } from "../json-ld";

type FaqAccordionProps = PagebuilderType<"faqAccordion"> & {
  isNested?: boolean;
};

export function FaqAccordion({
  eyebrow,
  title,
  subtitle,
  faqs,
  link,
  sectionId,
  isNested = false,
}: FaqAccordionProps) {
  const containerClassName = isNested ? undefined : "section-container-md6";
  const resolvedSectionId = sectionId?.trim() || "faq";

  return (
    <section className="my-8" id={resolvedSectionId}>
      <FaqJsonLd faqs={faqs} />
      <div className={containerClassName}>
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
            <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
            <h3 className="text-balance font-normal text-[#374151] text-lg dark:text-zinc-400">
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="mx-auto my-16 max-w-xl">
          <Accordion
            className="w-full"
            collapsible
            defaultValue="3"
            type="single"
          >
            {faqs?.map((faq, index) => (
              <AccordionItem
                className="py-2"
                key={`AccordionItem-${faq?._id}-${index}`}
                value={faq?._id}
              >
                <AccordionTrigger className="group py-2 text-[15px] leading-6 hover:no-underline">
                  {faq?.title}
                </AccordionTrigger>
                <AccordionContent className="pb-2 text-muted-foreground">
                  <RichText
                    className="text-sm md:text-base"
                    richText={faq?.richText ?? []}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {link?.href && (
            <div className="w-full py-6">
              <p className="mb-1 text-xs">{link?.title}</p>
              <Link
                className="flex items-center gap-2"
                href={link.href ?? "#"}
                target={link.openInNewTab ? "_blank" : "_self"}
              >
                <p className="font-medium text-[15px] leading-6">
                  {link?.description}
                </p>
                <span className="rounded-full border p-1">
                  <ArrowUpRight
                    className="text-[#374151] dark:text-neutral-300"
                    size={16}
                  />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
