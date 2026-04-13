export type DraggableItem =
  | {
      id: string;
      type: "text";
      coordinates: { x: number; y: number };
      text: { id: string; text: string; fontSize: string };
    }
  | {
      id: string;
      type: "file";
      coordinates: { x: number; y: number };
      file: { id: string; path: string; width: number; height: number };
    };

export type ApiItem = {
  id: string;
  type: "text" | "file";
  x: number;
  y: number;
  textItem: { id: string; text: string; fontSize: string } | null;
  fileItem: { id: string; path: string; width: number; height: number } | null;
};

export type FilePayload = { path: string; width: number; height: number };
export type TextUpdatePayload = {
  x: number;
  y: number;
  fontSize: string;
};

export type FileUpdatePayload = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type UpdatePayload = TextUpdatePayload | FileUpdatePayload;
