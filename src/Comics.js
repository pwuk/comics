import React, { useState, useEffect, useCallback } from "react";
import { Email, Item, Span, A, renderEmail } from "react-html-email";
import { ComicsTable } from "./ComicsTable";
import { PagerMenu } from "./PagerMenu";

let handle;

export function Comics() {
  const [search, setSearch] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [row, setRow] = useState(0);
  const [useTimeout, setUseTimeout] = useState(false);
  const [sortCol, setSortCol] = useState("title");
  const [sortDir, setSortDir] = useState("a");
  const [view, setView] = useState(false);
  const [selected, setSelected] = useState([]);
  const [pageBlock, setPageBlock] = useState(0);
  const pageSize = 20;

  const doTheSearchCallBack = useCallback(
    (searchKey) => {
      if (searchKey) {
        fetch(
          `https://paulskilton.co.uk/comics/get.php?q=${searchKey}&row=${row}&dir=${sortDir}&col=${sortCol}`
        )
          .then((r) => r.json())
          .then((result) => {
            setSearch(result.data);
            setCount(result.count);
          });
      }
      setLoading(false);
    },
    [row, sortCol, sortDir]
  );

  useEffect(() => {
    clearTimeout(handle);
    if (useTimeout) {
      handle = setTimeout(() => doTheSearchCallBack(searchKey), 2000);
    } else {
      doTheSearchCallBack(searchKey);
    }
  }, [doTheSearchCallBack, searchKey, row, sortCol, sortDir, useTimeout]);

  const searchChange = (e) => {
    setRow(0);
    setPageBlock(0);
    setSearch([]);
    setLoading(true);
    setUseTimeout(true);
    setSearchKey(e.target.value);
  };

  const setPageRow = (page) => {
    console.log(page);
    if (typeof page === "number") {
      setUseTimeout(false);
      setRow(page * pageSize);
      return;
    }
    if (page === ">>") {
      setPageBlock(pageBlock + 1);
      return;
    }
    if (page === "<<") {
      setPageBlock(pageBlock - 1);
      return;
    }
  };

  const setSort = (col) => {
    const sorting = { a: "d", d: "a" };
    const newSortDir = col === sortCol ? sorting[sortDir] : "a";

    setUseTimeout(false);
    setSortDir(newSortDir);
    setSortCol(col);
  };

  const selectHandler = (e, comic) => {
    if (selected.findIndex((c) => c.id === comic.id) === -1) {
      setSelected([...selected, comic]);
    } else {
      setSelected(selected.filter((c) => c.id !== comic.id));
    }
  };

  const clearSelection = () => {
    setSelected([]);
    setView(false);
  };

  const setViewScope = () => setView(!view);

  const data = view ? selected : search;
  view && selected.length === 0 && setView(false);

  let email = "";

  if (view) {
    const table = selected
      .map(
        (comic) => `
      ${comic.title}%0D%0A
      ${comic.coverdate}%0D%0A
      ${comic.issue}%0D%0A
      ${comic.publisher}%0D%0A
      ${comic.series}%0D%0A
    `
      )
      .join("%0D%0A");

    email = `mailto:mailbox@paulskilton.co.uk?subject=Comics website enquiry&body=${table}`;
  }

  return (
    <>
      {!view && (
        <div>
          <input
            placeholder="enter a search term"
            onChange={searchChange}
            value={searchKey}
          />
        </div>
      )}
      {loading ? (
        "Loading"
      ) : (
        <>
          {!view && searchKey && (
            <div>
              Found {count} comic{count === 1 ? "" : "s"}
            </div>
          )}
          {selected.length === 0 ? (
            <div>Nothing selected</div>
          ) : (
            <div className={"selection"}>
              Selected {selected.length} comic{selected.length === 1 ? "" : "s"}
              <button onClick={clearSelection}>Clear</button>
              <button onClick={() => setViewScope(!view)}>
                {view ? "View Main List" : "View Selected"}
              </button>
              {view && <a href={email}>Email enquiry about selection</a>}
            </div>
          )}
          <PagerMenu
            pageSize={pageSize}
            blockSize={10}
            blockNumber={pageBlock}
            visible={!view}
            count={count}
            currentPage={row}
            onClick={(page) => setPageRow(page)}
          />
          <ComicsTable
            data={data}
            count={count}
            view={view}
            sortCol={sortCol}
            onSortClick={(sortCol) => setSort(sortCol)}
            selectHandler={selectHandler}
            selected={selected}
            searchKey={searchKey}
          />
        </>
      )}
    </>
  );
}
