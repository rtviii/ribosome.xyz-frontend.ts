import { UIActions } from "./UIActions";
export interface PagewideFilter {
  filterValue: string;
}

export const inputFilterValue = (input: string): UIActions => ({
  type: "INPUT_FILTER_VALUE",
  payload: input,
});

const defaultValue: PagewideFilter = { filterValue: "" };

export const PagewideFilterReducer = (
  state: PagewideFilter = defaultValue,
  action: UIActions
): PagewideFilter => {
  switch (action.type) {
    case "INPUT_FILTER_VALUE":
      return { ...state, filterValue: action.payload };
    default:
      return state;
  }
};
