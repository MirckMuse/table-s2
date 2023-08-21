import { Group, Line, LineStyleProps, Rect, RectStyleProps, TextStyleProps, Text } from "@antv/g";
import { TextView } from "../ui";
import { Line_Default_ZIndex } from "../common/constant";

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
      ...textStyle,
    }
  }, appendInfo));
}

export function renderText(group: Group, textStyle: TextStyleProps) {
  return group.appendChild(new Text({
    style: {
      fontVariant: 'normal',
      fontStyle: 'normal',
      lineWidth: 1,
      ...textStyle,
    }
  }));
}

// 渲染一个矩形
export function renderRect(group: Group, style: RectStyleProps): Rect {
  return group.appendChild(new Rect({ style }));
}

// 渲染一条线
export function renderLine(group: Group, style: LineStyleProps): Line {
  return group.appendChild(new Line({
    style: {
      zIndex: Line_Default_ZIndex,
      ...style
    }
  }))
}
