import { EntityId } from "@reduxjs/toolkit";
import produce from "immer";
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import { getLine, getLineIds } from "../../../state/redux/selectors/story";
import { useSelector } from "../../../state/redux/store";
import { defaultConfig } from "../../../state/story/inkStoryConfig";
import arraysAreShallowEqual from "../../../util/arraysAreShallowEqual";
import splitArray from "../../../util/splitArray";
import Line from "../../ui/Line";
import LineGroup from "../../ui/LineGroup";
import LinesBox from "../../ui/LinesBox";

type LineGroupIdMap = Record<EntityId, number>;

interface LineGroupRegistry {
  register(lineId: EntityId): void;
  unregister(lineId: EntityId): void;
}
const lineGroupRegistryContext = createContext<LineGroupRegistry>({
  register() {},
  unregister() {},
});

function useLineGroupIdMap() {
  const [lineGroupIdMap, setLineGroupIdMap] = useState<LineGroupIdMap>({});
  const registerGroupHeading = useCallback((lineId: EntityId) => {
    setLineGroupIdMap(
      produce((pMap) => {
        if (pMap[lineId] == null) {
          pMap[lineId] = 0;
        }
        pMap[lineId] += 1;
      })
    );
  }, []);
  const unregisterGroupHeading = useCallback((lineId: EntityId) => {
    setLineGroupIdMap(
      produce((pMap) => {
        if (pMap[lineId] == null) return;
        pMap[lineId] -= 1;
        if (pMap[lineId] <= 0) {
          delete pMap[lineId];
        }
      })
    );
  }, []);

  const lineGroupRegistryCallbacks = useMemo<LineGroupRegistry>(
    () => ({
      register: registerGroupHeading,
      unregister: unregisterGroupHeading,
    }),
    [registerGroupHeading, unregisterGroupHeading]
  );

  return [lineGroupIdMap, lineGroupRegistryCallbacks] as const;
}

export default memo(function NarrativeLines() {
  const lineIds = useSelector(getLineIds);
  const [lineGroupIdMap, lineGroupRegistry] = useLineGroupIdMap();

  const linesByGroup = splitArray(
    lineIds,
    (lineId) => lineId in lineGroupIdMap && lineGroupIdMap[lineId] > 0,
    /**
     * It's imperative that we actually render delimiters.
     * They may render something to the DOM (such as an hr)
     * but since they notify the registry about existing in
     * the first place, we'll immediately forget they're
     * delimiters if we fail to render them. This causes an
     * infinite loop of rendering:
     * 1: recognize that they're delimiters
     * 2: stop rendering them because they're delimiters
     * 3: stop recognizing them as delimiters
     * 4: render them because we think they're normal text
     * 5: repeat
     */
    "start"
  );

  return (
    <LinesBox>
      <lineGroupRegistryContext.Provider value={lineGroupRegistry}>
        {linesByGroup.map((groupOfLineIds, groupIndex) => (
          <LineGroupWrapper
            groupIndex={groupIndex}
            key={groupOfLineIds[0]}
            lineIds={groupOfLineIds}
          />
        ))}
      </lineGroupRegistryContext.Provider>
    </LinesBox>
  );
});

interface NewLineGroupProps {
  lineId: EntityId;
}
function NewLineGroup({ lineId }: NewLineGroupProps) {
  const registry = useContext(lineGroupRegistryContext);
  useLayoutEffect(() => {
    registry.register(lineId);
    return () => {
      registry.unregister(lineId);
    };
  }, [registry, lineId]);

  return null;
}

interface LineGroupWrapperProps {
  lineIds: EntityId[];
  groupIndex: number;
}
const LineGroupWrapper = memo(
  function LineGroupWrapper({ lineIds, groupIndex }: LineGroupWrapperProps) {
    const firstLine = useSelector((state) => getLine(state, lineIds[0]));
    if (!lineIds.length) {
      return null;
    }

    return (
        <LineGroup firstLine={firstLine ?? null}>
          {lineIds.map((lineId) => (
            <LineWrapper
              key={lineId}
              lineId={lineId}
              groupHeadingId={firstLine?.id}
            />
          ))}
        </LineGroup>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.groupIndex === nextProps.groupIndex &&
      arraysAreShallowEqual(prevProps.lineIds, nextProps.lineIds)
    );
  }
);

interface LineWrapperProps {
  lineId: EntityId;
  groupHeadingId?: EntityId | null;
}
const LineWrapper = memo(function LineWrapper({
  lineId,
  groupHeadingId,
}: LineWrapperProps) {
  const line = useSelector((state) => getLine(state, lineId));
  const groupHeading = useSelector((state) =>
    !groupHeadingId ? null : getLine(state, groupHeadingId)
  );

  if (line == null) {
    return null;
  }
  const delimiterTags = defaultConfig.lineGrouping?.delimiterTags;
  const lineTags = line.tags;
  return (
    <>
      {!!(delimiterTags && lineTags) &&
        lineTags.some((tag) => delimiterTags.includes(tag)) && (
          <NewLineGroup lineId={line.id} />
        )}
      <Line lineData={line} groupHeading={groupHeading ?? null} />
    </>
  );
});
