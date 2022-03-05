type EntityId = string | number;

/**
 * Group IDs in an ordered sequence into ordered groupings of IDs, based on
 * a provided definition. The definition consists of an array of a numbers.
 * - A positive number in the definition indicates that the ID at the
 * corresponding index in the list of IDs is the first entry in a new group.
 * - Zero indicates that the corresponding ID is a member of the preceding
 * group.
 * - A negative number indicates that the ID is not a member of any groups,
 * and should appear directly in the output outside of a group.
 * @param entityIds An ordered list of IDs
 * @param groupDefinitions An array of the same length as `entityIds`
 */
export default function groupEntityIds(
  entityIds: EntityId[],
  groupDefinitions: number[]
) {
  let groupedIds: (EntityId | EntityId[])[] = [];

  // Need to handle the scenario where the first entry is negative.
  if (groupDefinitions[0] < 0) {
    groupedIds.push(entityIds[0], []);
  } else {
    groupedIds.push([entityIds[0]]);
  }

  // Start at 1 given we handled the first entry as a special case.
  for (let i = 1; i < entityIds.length; i++) {
    while (groupDefinitions[i] === 0) {
      (groupedIds[groupedIds.length - 1] as EntityId[]).push(entityIds[i]);
      i += 1;
    }
    if (groupDefinitions[i] < 0) {
      groupedIds.push(entityIds[i], []);
    } else if (groupDefinitions[i] > 0) {
      groupedIds.push([]);
    }
  }

  if ((groupedIds[groupedIds.length - 1] as EntityId[])?.length === 0) {
    groupedIds.pop();
  }

  return groupedIds;
}
