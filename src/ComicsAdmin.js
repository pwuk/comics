import React, { useState, useEffect } from "react";
import { ComicsTable } from "./ComicsTable";

import { PagerMenu } from "./PagerMenu";

export function ComicsAdmin() {
  const [search, setSearch] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [row, setRow] = useState(0);
  const [useTimeout, setUseTimeout] = useState(false);
  const [sortCol, setSortCol] = useState("title");
  const [sortDir, setSortDir] = useState("a");
  const [pageBlock, setPageBlock] = useState(0);
  const pageSize = 20;

  const doTheSearch = (searchKey) => {
    if (searchKey) {
      fetch(
        `//paulskilton.co.uk/comics/get.php?q=${searchKey}&row=${row}&dir=${sortDir}&col=${sortCol}`
      )
        .then((r) => r.json())
        .then((result) => {
          setSearch(result.data);
          setCount(result.count);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    clearTimeout(handle);
    if (useTimeout) {
      handle = setTimeout(() => doTheSearch(searchKey), 2000);
    } else {
      doTheSearch(searchKey);
    }
  }, [searchKey, row, sortCol, sortDir]);

  const searchChange = (e) => {
    setRow(0);
    setSearch([]);
    setPageBlock(0);
    setLoading(true);
    setUseTimeout(true);
    setSearchKey(e.target.value);
  };

  const setPageRow = (page) => {
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

  return (
    <div className="App">
      <header className="App-header">
        Comics database
        <div>
          <input
            placeholder="enter a search term"
            onChange={searchChange}
            value={searchKey}
          />
        </div>
        {loading ? (
          "Loading"
        ) : (
          <>
            {searchKey && (
              <div>
                Found {count} comic{count === 1 ? "" : "s"}
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
              data={search}
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
      </header>
    </div>
  );
}
