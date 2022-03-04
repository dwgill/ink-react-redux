export interface InkStoryConfig {
  version: 1;
  trackedVariables?: null | {
    bool?: string[];
    int?: string[];
    float?: string[];
  };
  forceBreakAfterChoices?: null | {
    enabled: boolean;
    tags?: string[];
  };
  lineGrouping?: null | {
    delimiterTags: string[];
    excludedTags: string[];
  };
}

export const defaultConfig: InkStoryConfig = {
  version: 1,
  trackedVariables: {
    bool: [],
    int: [],
    float: [],
  },
  forceBreakAfterChoices: {
    enabled: false,
    tags: [],
  },
  lineGrouping: {
    delimiterTags: ['foobar'],
    excludedTags: [],
  },
};
