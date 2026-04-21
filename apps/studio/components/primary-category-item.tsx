import { Badge, Box, Flex } from "@sanity/ui";
import type { PrimitiveItemProps } from "sanity";

export function PrimaryCategoryItem(props: PrimitiveItemProps) {
  const isPrimary = props.index === 0;

  return (
    <Flex align="center" gap={2}>
      <Box flex={1}>{props.renderDefault(props)}</Box>
      {isPrimary ? (
        <Badge mode="outline" tone="positive">
          Primary
        </Badge>
      ) : null}
    </Flex>
  );
}
