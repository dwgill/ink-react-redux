import React, { ReactNode } from "react";

interface LinesBox {
  children: ReactNode;
}
export default function LinesBox({
  children,
}: LinesBox) {
  return <>{children}</>;
}
