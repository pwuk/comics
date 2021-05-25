import React from "react";

const showHighLight = (text, searchKey) => {
  const regex = new RegExp(`(${searchKey})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span className={"search-highlight"} key={i}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const ComicsTable = ({
  data,
  count,
  view,
  sortCol,
  onSortClick,
  selectHandler,
  selected,
  searchKey
}) =>
  count <= 0 ? null : (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>
            <button
              className={
                !view && sortCol === "title" ? "sortItem selected" : "sortItem"
              }
              onClick={() => onSortClick("title")}
            >
              Title
            </button>
          </th>
          <th>
            <button
              className={
                !view && sortCol === "coverdate"
                  ? "sortItem selected"
                  : "sortItem"
              }
              onClick={() => onSortClick("coverdate")}
            >
              Date
            </button>
          </th>
          <th>
            <button
              className={
                !view && sortCol === "issue" ? "sortItem selected" : "sortItem"
              }
              onClick={() => onSortClick("issue")}
            >
              Issue
            </button>
          </th>
          <th>
            <button
              className={
                !view && sortCol === "publisher"
                  ? "sortItem selected"
                  : "sortItem"
              }
              onClick={() => onSortClick("publisher")}
            >
              Publisher
            </button>
          </th>
          <th>
            <button
              className={
                !view && sortCol === "series" ? "sortItem selected" : "sortItem"
              }
              onClick={() => onSortClick("series")}
            >
              Series
            </button>
          </th>
        </tr>
        {data.map((comic) => (
          <tr key={comic.id}>
            <td>
              <input
                type="checkbox"
                onChange={(e) => selectHandler(e, comic)}
                checked={selected.findIndex((c) => comic.id === c.id) !== -1}
              />
            </td>
            <td>{showHighLight(comic["title"], searchKey)}</td>
            <td>{showHighLight(comic["coverdate"], searchKey)}</td>
            <td className={"right-align"}>
              {showHighLight(comic["issue"], searchKey)}
            </td>
            <td>{showHighLight(comic["publisher"], searchKey)}</td>
            <td>{showHighLight(comic["series"], searchKey)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

export { ComicsTable };
