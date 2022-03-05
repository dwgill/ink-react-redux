export enum LineKind {
  Text = "text",
}

export enum LineOrigin {
  Story = "story",
  Choice = "choice",
}

interface AbstractLine {
  readonly id: string;
  readonly kind: unknown;
  readonly origin: unknown;
  readonly index: number;
  readonly meta?: Record<string, any>;
  readonly tags?: Record<string, true>;
  readonly groupTags?: string[];
  readonly ungroupTags?: string[];
}

export interface TextualLine extends AbstractLine {
  readonly kind: LineKind.Text;
  readonly text: string;
  readonly origin: LineOrigin.Story | LineOrigin.Choice;
}

export type Line = TextualLine;
