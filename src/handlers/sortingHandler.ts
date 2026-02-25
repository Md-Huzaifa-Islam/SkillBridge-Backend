export const sortingHandler = ({
  sort_by = "desc",
  sort_order = "createdAt",
}: {
  sort_by?: string;
  sort_order?: string;
}) => {
  return {
    sortBy: sort_by,
    sortOrder: sort_order,
  };
};
