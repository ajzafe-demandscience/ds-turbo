import { author } from "@/schemaTypes/documents/author";
import { blog } from "@/schemaTypes/documents/blog";
import { blogIndex } from "@/schemaTypes/documents/blog-index";
import { category } from "@/schemaTypes/documents/category";
import { companyLogoCarouselConfig } from "@/schemaTypes/documents/company-logo-carousel-config";
import { faq } from "@/schemaTypes/documents/faq";
import { footer } from "@/schemaTypes/documents/footer";
import { homePage } from "@/schemaTypes/documents/home-page";
import { landingPage } from "@/schemaTypes/documents/landing-page";
import { landingPageIndex } from "@/schemaTypes/documents/landing-page-index";
import { navbar } from "@/schemaTypes/documents/navbar";
import { page } from "@/schemaTypes/documents/page";
import { redirect } from "@/schemaTypes/documents/redirect";
import { settings } from "@/schemaTypes/documents/settings";

export const singletons = [
  homePage,
  blogIndex,
  landingPageIndex,
  companyLogoCarouselConfig,
  settings,
];

export const documents = [
  blog,
  landingPage,
  category,
  page,
  faq,
  author,
  footer,
  navbar,
  ...singletons,
  redirect,
];
