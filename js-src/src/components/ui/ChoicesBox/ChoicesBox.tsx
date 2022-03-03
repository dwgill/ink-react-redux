import React, { ReactNode } from "react";

interface ChoicesBoxProps {
  children: ReactNode;
}
export default function ChoicesBox({
  children,
}: ChoicesBoxProps) {
  return <menu>{children}</menu>;
}
