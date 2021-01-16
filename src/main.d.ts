import { CSSProperties } from "react";
import { UseMeasureResult } from "react-use/lib/useMeasure";

declare class Position {
  row: number = 0;
  top: number = 0;
  left: number = 0;
  units?: string = "px";
}

declare class Item {
  key: string;
  width: number;
  height?: number;
  // measure: UseMeasureResult
  // bgColor?: string;
  style?: CSSProperties;
}

// { key: "1", bgcolor: "cyan", measure: useMeasure() }, 