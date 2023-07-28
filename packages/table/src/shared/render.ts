import { Group, Rect, RectStyleProps, TextStyleProps } from "@antv/g";
import { TextView } from "../ui";

// 渲染一个文本
export function renderTextView<T = any>(group: Group, textview: TextView<T>, textStyle: TextStyleProps, appendInfo?: T) {
  if (group.contains(textview)) {
    group.removeChild(textview);
  }
  return group.appendChild(new TextView<T>({
    style: {
      fontVariant: 'normal',
      fontStyle: 'normal',
      lineWidth: 1,
      ...textStyle
    }
  }, appendInfo))
}

// 渲染一个矩形
export function renderRect(group: Group, style: RectStyleProps): Rect {
  return group.appendChild(new Rect({ style }))
}
