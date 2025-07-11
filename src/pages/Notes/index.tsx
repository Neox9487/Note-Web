import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "./index.module.scss";
import getAllNotes from "../../api/note/getAllNotes";

type Note = {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
};

export default function Notes() {
  const location = useLocation();
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    getAllNotes().then((res) => {
      if (res.success) 
        setAllNotes(res.notes);
      else 
        alert(res.message);
    });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const tags = searchParams.getAll("tag");

    const result = allNotes.filter((note) => {
      const matchQuery = !query || note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
      const matchTags = tags.length === 0 || tags.every((tag) => note.tags.includes(tag));
      return matchQuery && matchTags;
    });

    setFilteredNotes(result);
  }, [location.search, allNotes]);

  return (
    <div className={styles.wrapper}>
      
    </div>
  );
}