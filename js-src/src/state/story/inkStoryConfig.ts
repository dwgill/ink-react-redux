export interface InkStoryConfig {
  version: 1;
  trackedVariables?: null | {
    bool?: string[];
    int?: string[];
    float?: string[];
  };
  lineGrouping?: null | {
    groupTags: string[];
    grouplessTags: string[];
  };
}

export const defaultConfig: InkStoryConfig = {
  version: 1,
  trackedVariables: {
    bool: [],
    int: [],
    float: [],
  },
  lineGrouping: {
    groupTags: ['group'],
    grouplessTags: ['nogroup'],
  },
};
