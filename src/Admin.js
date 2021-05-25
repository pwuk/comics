import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./Context";

let handle;

export function Admin(props) {
  const context = useContext(AuthContext);

  const [search, setSearch] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [row, setRow] = useState(0);
  const [useTimeout, setUseTimeout] = useState(false);
  const [sortCol, setSortCol] = useState("title");
  const [sortDir, setSortDir] = useState("a");
  const [view, setView] = useState(false);
  const [markUnavailableConfirm, setMarkUnavailableConfirm] = useState(false);

  const [selected, setSelected] = useState([]);

  const doTheSearch = (searchKey) => {
    if (searchKey) {
      fetch(
        `https://paulskilton.co.uk/comics/get.php?q=${searchKey}&row=${row}&dir=${sortDir}&col=${sortCol}&t=${context.auth}`
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
    setLoading(true);
    setUseTimeout(true);
    setSearchKey(e.target.value);
  };

  const pageMenu = new Array(
    parseInt(count / 25, 10) + Number(Boolean(count % 25))
  )
    .fill(0)
    .map((p, index) => index);
  const setPageRow = (page, e) => {
    setUseTimeout(false);
    setRow(page * 25);
  };

  const setSort = (col) => {
    const sorting = { a: "d", d: "a" };
    const newSortDir = col === sortCol ? sorting[sortDir] : "a";

    setUseTimeout(false);
    setSortDir(newSortDir);
    setSortCol(col);
  };

  const showHighLight = (text) => {
    const regex = new RegExp(`(${searchKey})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts
          .map((part) => part)
          .map((part, i) =>
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

  const selectHandler = (e, comic) => {
    if (selected.findIndex((c) => c.id === comic.id) === -1) {
      setSelected([...selected, comic]);
    } else {
      setSelected([...selected.filter((c) => c.id !== comic.id)]);
    }
  };

  const clearSelection = (e) => {
    setSelected([]);
  };

  const setViewScope = () => setView(!view);

  const markUnavailable = (e) => {
    setMarkUnavailableConfirm(false);
    fetch(
      `https://paulskilton.co.uk/comics/unavail.php?c=${selected
        .map((c) => c.id)
        .join(",")}&t=${context.auth}`
    )
      .then((r) => r.json())
      .then((result) => {
        if (result[0].response === "1") {
          clearSelection(e);
          setUseTimeout(false);
          doTheSearch(searchKey);
        } else {
          props.history.push("/login");
        }
      });
  };

  const data = view ? selected : search;
  view && selected.length === 0 && setView(false);

  return (
    <>
      <div className="admin-title">Administrator page</div>
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
              {!markUnavailableConfirm && (
                <>
                  Selected {selected.length} comic
                  {selected.length === 1 ? "" : "s"}
                </>
              )}
              {!markUnavailableConfirm && (
                <>
                  <a href="javascript:;" onClick={clearSelection}>
                    Clear
                  </a>
                  <a href="javascript:;" onClick={() => setViewScope(!view)}>
                    {view ? "View Main List" : "View Selected"}
                  </a>
                </>
              )}
              {view && !markUnavailableConfirm && (
                <a
                  href="javscript:;"
                  onClick={() => setMarkUnavailableConfirm(true)}
                >
                  Mark Unavailable
                </a>
              )}
              {view && markUnavailableConfirm && (
                <>
                  Confirm{" "}
                  <a href="javscript:;" onClick={markUnavailable}>
                    Yes
                  </a>{" "}
                  ||{" "}
                  <a
                    href="javscript:;"
                    onClick={() => setMarkUnavailableConfirm(false)}
                  >
                    No
                  </a>
                </>
              )}
            </div>
          )}
          {!view &&
            pageMenu.length >= 2 &&
            pageMenu.map((page) => (
              <button
                className={
                  page * 25 === row ? "pagemenuItem selected" : "pagemenuItem"
                }
                href="javascript:;"
                onClick={(e) => setPageRow(page, e)}
              >
                {page + 1}
              </button>
            ))}
          {count > 0 && (
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>
                    <a
                      href="#sort"
                      className={
                        !view && sortCol === "title"
                          ? "sortItem selected"
                          : "sortItem"
                      }
                      onClick={() => setSort("title")}
                    >
                      Title
                    </a>
                  </th>
                  <th>
                    <a
                      href="#sort"
                      className={
                        !view && sortCol === "coverdate"
                          ? "sortItem selected"
                          : "sortItem"
                      }
                      onClick={() => setSort("coverdate")}
                    >
                      Date
                    </a>
                  </th>
                  <th>
                    <a
                      href="#sort"
                      className={
                        !view && sortCol === "issue"
                          ? "sortItem selected"
                          : "sortItem"
                      }
                      onClick={() => setSort("issue")}
                    >
                      Issue
                    </a>
                  </th>
                  <th>
                    <a
                      href="#sort"
                      className={
                        !view && sortCol === "publisher"
                          ? "sortItem selected"
                          : "sortItem"
                      }
                      onClick={() => setSort("publisher")}
                    >
                      Publisher
                    </a>
                  </th>
                  <th>
                    <a
                      href="#sort"
                      className={
                        !view && sortCol === "series"
                          ? "sortItem selected"
                          : "sortItem"
                      }
                      onClick={() => setSort("series")}
                    >
                      Series
                    </a>
                  </th>
                </tr>
                {data.map((comic) => (
                  <tr key={comic.id}>
                    <td>
                      <input
                        type="checkbox"
                        onClick={(e) => selectHandler(e, comic)}
                        checked={
                          selected.findIndex((c) => comic.id === c.id) !== -1
                        }
                      />
                    </td>
                    <td>{showHighLight(comic["title"])}</td>
                    <td>{showHighLight(comic["coverdate"])}</td>
                    <td className={"right-align"}>
                      {showHighLight(comic["issue"])}
                    </td>
                    <td>{showHighLight(comic["publisher"])}</td>
                    <td>{showHighLight(comic["series"])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}
