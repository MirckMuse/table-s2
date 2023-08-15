import { Group } from "@antv/g";

export function translateX(group: Group, scrollX: number) {
  if (!group) return;

  group.translate(-scrollX, 0)
}

export function translateY(group: Group, scrollY: number) {
  if (!group) return;

  group.translate(0, -scrollY)
}

export function translateGroup(group: Group, scrollX: number, scrollY: number) {
  if (!group) return;

  group.translate(-scrollX, -scrollY)
}