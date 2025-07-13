import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./index.module.scss";
import { Tags } from "../constants/Tags";

import Loading from "../widgets/Loading";
import fetchMe from "../api/user/me";

const menuOptions = [
  {label: "Home", path: "/"},
  {label: "Notes", path: "/note"}
]

export default function Layout() {
  const [loading, setLoading] = useState<boolean>(true); 
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [showTags, setShowTags] = useState<boolean>(false); 
  
  const [username, setUsername] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const hasAuthRef = useRef<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(()=>{
    if (hasAuthRef.current) return;
    hasAuthRef.current=true;

    setTags(Tags);

    // if(!localStorage.getItem("access_token")) {
    //   alert("未登入");
    //   navigate("/login");
    // }

    // fetchMe()
    //   .then((result)=>{
    //     if(result.success && result.username!=null) {
    //       setUsername(result.username);
    //       setLoading(false);
    //     }
    //     else {
    //       alert("驗證失敗，請重新登入");
    //       navigate("/login");
    //     }
    //   })
    //   .catch(()=>{
    //     alert("無法連接伺服器");
    //     navigate("/login");
    //   })

    // test
    setUsername("Username");
    setLoading(false);
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) 
        setMenuOpened(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(target) 
      ) 
        setShowTags(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSearch = (query: string, tags: string[]) => {
    const params = new URLSearchParams();
    tags.forEach((tag) => {
      params.append("tags", tag)
    })
    navigate(`/search?q=${query}&${params.toString()}`);
  };

  const toggleTag = (tag: string) => {
    let newSelected: string[];
    if (selectedTags.includes(tag)) {
      newSelected = selectedTags.filter((t) => t !== tag);
    } else {
      newSelected = [...selectedTags, tag];
    }
    setSelectedTags(newSelected);
  };

  return (
    <div>
      {loading ? 
        <Loading/>
          :
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.menuButton} ref={menuButtonRef} onClick={() => setMenuOpened((prev) => !prev)}>
              ☰
            </div>
            {menuOpened &&
              <div className={styles.menu} ref={menuRef}>
                {menuOptions.map((option, index) => {
                  const animClass = menuOpened ? styles.fadeIn : styles.fadeOut;
                  return (
                    <div
                      key={index}
                      className={`${styles.menuOption} ${animClass}`}
                      onClick={() => {
                        navigate(option.path);
                        setMenuOpened(false);
                      }}
                    >
                      {option.label}
                    </div>
                  );
                })}
              </div>
            }
            <div className={styles.searchBar} ref={searchBarRef}>
              <input 
                className={styles.inputField}
                placeholder="Search your notes here ....."
                value={query}
                onChange={(e)=>{setQuery(e.target.value)}}
                onClick={()=>{setShowTags(true)}}
                onKeyDown={(e)=>{
                  if (e.key === "Enter" && !(query.trim() == "" && selectedTags.length == 0)) {
                    onSearch(query.trim(), selectedTags)
                  }
                }}
              />
              {showTags &&
                <div className={styles.tags}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${styles.tag} ${selectedTags.includes(tag) ? styles.selected : ""}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            </div>
            <div className={styles.username}>
              {username}
            </div>
          </div>
          <div className={styles.body}>
            <Outlet/>
          </div>
        </div>
      }
    </div>
  );
};