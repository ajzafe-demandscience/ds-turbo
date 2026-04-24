import { h1 } from "@/schemaTypes/objects/h1";
import { imageBlock } from "@/schemaTypes/objects/image";
import { p } from "@/schemaTypes/objects/p";
import { pardotForm } from "@/schemaTypes/objects/pardot-form";

/**
 * Object types embedded inside page builder blocks (not pickable as top-level
 * page builder items).
 */
export const pageBuilderObjects = [h1, imageBlock, p, pardotForm];
