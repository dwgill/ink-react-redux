import produce from 'immer';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ParagraphIndexMap = Record<number, number>;

export interface ParagraphRegistry {
  register(index: number): void;
  unregister(index: number): void;
}
export const paragraphRegistryContext = createContext<ParagraphRegistry>({
  register() {},
  unregister() {},
});

export function useParagraphIndexMap() {
  const [paragraphIndexMap, setParagraphIndexMap] = useState<ParagraphIndexMap>({});
  const registerPIndex = useCallback((lineIndex: number) => {
    setParagraphIndexMap(
      produce((pMap) => {
        if (pMap[lineIndex] == null) {
          pMap[lineIndex] = 0;
        }
        pMap[lineIndex] += 1;
      })
    );
  }, []);
  const unregisterPIndex = useCallback((lineIndex: number) => {
    setParagraphIndexMap(
      produce((pMap) => {
        if (pMap[lineIndex] == null) return;
        pMap[lineIndex] -= 1;
        if (pMap[lineIndex] === 0) {
          delete pMap[lineIndex];
        }
      })
    );
  }, []);

  const paragraphRegistryCallbacks = useMemo<ParagraphRegistry>(
    () => ({
      register: registerPIndex,
      unregister: unregisterPIndex,
    }),
    [registerPIndex, unregisterPIndex]
  );

  return [paragraphIndexMap, paragraphRegistryCallbacks] as const;
}