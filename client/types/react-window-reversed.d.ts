declare module "react-window-reversed" {
  import { VariableSizeListProps, FixedSizeListProps } from "react-window-reversed";

  export class VariableSizeList<T = any> extends React.Component<
    VariableSizeListProps<T|any>
  > {}
  export class FixedSizeList<T = any> extends React.Component<FixedSizeListProps<T>> {}
}
