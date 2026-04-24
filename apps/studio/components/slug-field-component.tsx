import { CopyIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";
import {
  type ObjectFieldProps,
  type SanityDocument,
  type SlugValue,
  set,
  unset,
  useFormValue,
} from "sanity";

import { ValidationMessages } from "@/components/url-slug/validation-messages";
import {
  cleanSlug,
  generateSlugFromTitle,
} from "@/utils/slug-validation";

const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

const blogPublicPathPrefix = "/resources/blog";
const webinarPublicPathPrefix = "/resources";
const landingPagePublicPathPrefix = "/demand";

const monoStyle = { fontFamily: "monospace" } as const;

export function PathnameFieldComponent(props: ObjectFieldProps<SlugValue>) {
  const {
    inputProps: { onChange, value, readOnly },
    title,
    description,
    validation,
  } = props;

  const document = useFormValue([]) as SanityDocument;
  const currentSlug = value?.current || "";

  const errors = useMemo(
    () => [
      ...new Set(
        validation
          .filter((v) => v.level === "error")
          .flatMap((v) => v.message.split("; "))
      ),
    ],
    [validation]
  );
  const warnings = useMemo(
    () => [
      ...new Set(
        validation
          .filter((v) => v.level === "warning")
          .flatMap((v) => v.message.split("; "))
      ),
    ],
    [validation]
  );

  const localizedPathname = currentSlug.startsWith("/")
    ? currentSlug
    : `/${currentSlug}`;
  const fullUrl = `${presentationOriginUrl ?? ""}${localizedPathname}`;

  const handleChange = useCallback(
    (newValue?: string) => {
      try {
        const patch =
          typeof newValue === "string"
            ? set({ current: newValue, _type: "slug" })
            : unset();
        onChange(patch);
      } catch {
        // Validation will show user-friendly messages
      }
    },
    [onChange]
  );

  const handleSlugChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.value);
    },
    [handleChange]
  );

  const handleGenerate = useCallback(() => {
    try {
      const documentTitle = document?.title as string | undefined;
      const documentType = document?._type;

      if (!(documentTitle?.trim() && documentType)) {
        return;
      }

      const generatedSlug = generateSlugFromTitle(
        documentTitle,
        documentType,
        currentSlug
      );

      if (generatedSlug) {
        handleChange(generatedSlug);
      }
    } catch {
      // Silently handle errors
    }
  }, [document?.title, document?._type, currentSlug, handleChange]);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      try {
        const textArea = globalThis.document?.createElement("textarea");
        if (textArea && globalThis.document?.body) {
          textArea.value = fullUrl;
          globalThis.document.body.appendChild(textArea);
          textArea.select();
          globalThis.document.execCommand?.("copy");
          globalThis.document.body.removeChild(textArea);
        }
      } catch {
        // Silently handle fallback errors
      }
    }
  }, [fullUrl]);

  const generateDisabled =
    !(typeof document?.title === "string" && document.title.trim()) || readOnly;

  return (
    <Stack space={4}>
      {(title || description) && (
        <Stack space={2}>
          {title && (
            <Text size={1} weight="semibold">
              {title}
            </Text>
          )}
          {description && (
            <Text muted size={1}>
              {description}
            </Text>
          )}
        </Stack>
      )}

      <Stack space={4}>
        <Stack space={2}>
          <Text size={1} weight="medium">
            Slug
          </Text>
          <Flex align="center" gap={2}>
            <Box flex={1}>
              <TextInput
                disabled={readOnly}
                fontSize={1}
                onChange={handleSlugChange}
                placeholder="e.g., /about-us"
                style={monoStyle}
                value={currentSlug}
              />
            </Box>
            <Button
              disabled={generateDisabled}
              fontSize={1}
              mode="ghost"
              onClick={handleGenerate}
              text="Generate"
              tone="primary"
            />
          </Flex>
        </Stack>

        <ValidationMessages errors={errors} warnings={warnings} />

        <Text muted size={1}>
          Only lowercase letters, numbers, hyphens, and slashes are allowed.
        </Text>

        {currentSlug && errors.length === 0 && (
          <Stack space={2}>
            <Text size={1} weight="medium">
              Preview
            </Text>
            <Flex align="center" gap={2}>
              <Card border flex={1} padding={3} radius={2} tone="transparent">
                <Text muted size={1} style={monoStyle}>
                  {fullUrl}
                </Text>
              </Card>
              <Button
                icon={CopyIcon}
                mode="ghost"
                onClick={handleCopyUrl}
                padding={2}
                title="Copy URL"
              />
            </Flex>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function normalizeSingleSegmentSlug(raw: string, publicPathPrefix: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  const withoutHostPath = trimmed
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(new RegExp(`^${publicPathPrefix}/?`, "i"), "")
    .replace(/^\//, "");
  const segment = withoutHostPath.split("/").filter(Boolean)[0] ?? "";
  return segment;
}

/** Blog post slug: single segment; preview URL {origin}/resources/blog/{slug} */
export function BlogSlugFieldComponent(props: ObjectFieldProps<SlugValue>) {
  const {
    inputProps: { onChange, value, readOnly },
    title,
    description,
    validation,
  } = props;

  const document = useFormValue([]) as SanityDocument;
  const publicPathPrefixFromProps = (
    props as ObjectFieldProps<SlugValue> & { publicPathPrefix?: string }
  ).publicPathPrefix;
  const publicPathPrefix =
    publicPathPrefixFromProps ??
    (document?._type === "webinar"
      ? webinarPublicPathPrefix
      : document?._type === "landingPage"
        ? landingPagePublicPathPrefix
        : blogPublicPathPrefix);
  const currentSlug = (value?.current ?? "").trim();
  const segment = normalizeSingleSegmentSlug(currentSlug, publicPathPrefix);

  const errors = useMemo(
    () => [
      ...new Set(
        validation
          .filter((v) => v.level === "error")
          .flatMap((v) => v.message.split("; "))
      ),
    ],
    [validation]
  );
  const warnings = useMemo(
    () => [
      ...new Set(
        validation
          .filter((v) => v.level === "warning")
          .flatMap((v) => v.message.split("; "))
      ),
    ],
    [validation]
  );

  const pathname = segment ? `${publicPathPrefix}/${segment}` : "";
  const fullUrl = `${presentationOriginUrl ?? ""}${pathname}`;

  const handleChange = useCallback(
    (newValue?: string) => {
      try {
        const patch =
          typeof newValue === "string"
            ? set({ current: newValue, _type: "slug" })
            : unset();
        onChange(patch);
      } catch {
        // Validation will show user-friendly messages
      }
    },
    [onChange]
  );

  const handleSlugChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = normalizeSingleSegmentSlug(e.target.value, publicPathPrefix);
      handleChange(next);
    },
    [handleChange, publicPathPrefix]
  );

  const handleGenerate = useCallback(() => {
    try {
      const documentTitle = document?.title as string | undefined;
      if (!(documentTitle?.trim() && document)) {
        return;
      }
      const generated = cleanSlug(documentTitle);
      if (generated) {
        handleChange(generated);
      }
    } catch {
      // Silently handle errors
    }
  }, [document?.title, document, handleChange]);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      try {
        const textArea = globalThis.document?.createElement("textarea");
        if (textArea && globalThis.document?.body) {
          textArea.value = fullUrl;
          globalThis.document.body.appendChild(textArea);
          textArea.select();
          globalThis.document.execCommand?.("copy");
          globalThis.document.body.removeChild(textArea);
        }
      } catch {
        // Silently handle fallback errors
      }
    }
  }, [fullUrl]);

  const generateDisabled =
    !(typeof document?.title === "string" && document.title.trim()) || readOnly;

  return (
    <Stack space={4}>
      {(title || description) && (
        <Stack space={2}>
          {title && (
            <Text size={1} weight="semibold">
              {title}
            </Text>
          )}
          {description && (
            <Text muted size={1}>
              {description}
            </Text>
          )}
        </Stack>
      )}

      <Stack space={4}>
        <Stack space={2}>
          <Text size={1} weight="medium">
            Slug
          </Text>
          <Flex align="center" gap={2}>
            <Box flex={1}>
              <TextInput
                disabled={readOnly}
                fontSize={1}
                onChange={handleSlugChange}
                placeholder="e.g. my-article"
                style={monoStyle}
                value={segment}
              />
            </Box>
            <Button
              disabled={generateDisabled}
              fontSize={1}
              mode="ghost"
              onClick={handleGenerate}
              text="Generate"
              tone="primary"
            />
          </Flex>
        </Stack>

        <ValidationMessages errors={errors} warnings={warnings} />

        <Text muted size={1}>
          One segment only: lowercase letters, numbers, and hyphens. No slashes.
          The live URL will be {publicPathPrefix}/ plus this slug.
        </Text>

        {segment && errors.length === 0 && (
          <Stack space={2}>
            <Text size={1} weight="medium">
              Preview
            </Text>
            <Flex align="center" gap={2}>
              <Card border flex={1} padding={3} radius={2} tone="transparent">
                <Text muted size={1} style={monoStyle}>
                  {fullUrl}
                </Text>
              </Card>
              <Button
                icon={CopyIcon}
                mode="ghost"
                onClick={handleCopyUrl}
                padding={2}
                title="Copy URL"
              />
            </Flex>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
