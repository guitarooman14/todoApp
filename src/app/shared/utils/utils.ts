namespace Utils {
  export function getNextIdNotUsed(existingIds: number[]): number {
    return Math.max.apply(null, existingIds) + 1;
  }
}
