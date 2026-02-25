export const paginationHandler = ({
  page = "1",
  size = "10",
}: {
  page?: string;
  size?: string;
}) => {
  const take = Number(size);
  const skip = take * (Number(page) - 1);
  return {
    take,
    skip,
  };
};
