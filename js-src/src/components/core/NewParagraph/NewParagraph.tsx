import React, { useContext, useLayoutEffect } from "react";
import { paragraphRegistryContext } from "./paragraphRegistry";

interface NewParagraphProps {
  index: number;
}
export default function NewParagraph({ index }: NewParagraphProps) {
  const registry = useContext(paragraphRegistryContext);
  useLayoutEffect(() => {
    registry.register(index);
    return () => {
      registry.unregister(index);
    };
  }, [registry, index]);

  return null;
}
