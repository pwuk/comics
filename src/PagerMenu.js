import React from "react";

const PagerMenu = ({
  count,
  currentPage,
  onClick,
  visible,
  blockNumber = 0,
  blockSize,
  pageSize = 20
}) => {
  const pages = Math.floor(count / 25) + Number(Boolean(count % pageSize));
  if (pages <= 1 || !visible) return null;

  const pageMenu = Array.from({ length: pages }, (_, index) => index);
  const blocksCount = Math.floor(
    pageMenu.length / blockSize + Number(Boolean(pageMenu.length % blockSize))
  );

  const blocks = Array.from({ length: blocksCount }, (_, i) =>
    pageMenu.splice(0, blockSize)
  ).map((block, index, all) => {
    if (index === 0) {
      return all.length - 1 > index ? [...block, ">>"] : block;
    }
    if (index === all.length - 1) {
      return ["<<", ...block];
    }
    return ["<<", ...block, ">>"];
  });

  return (
    <div className={"page-menu-container"}>
      {blocks[blockNumber].map((page, index) => (
        <button
          key={page}
          className={
            page * pageSize === currentPage
              ? "pagemenuItem selected"
              : "pagemenuItem"
          }
          onClick={() => onClick(page)}
        >
          {typeof page === "number" ? page + 1 : page}
        </button>
      ))}
    </div>
  );
};

export { PagerMenu };
