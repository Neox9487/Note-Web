import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

import updateNote from "../../api/note/updateNote";
import deleteNote from "../../api/note/deleteNote";

import NoteEditor from "../../widgets/NoteEditor";
import getFiltedNotes from "../../api/note/getFiltedNotes";

type Note = {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
};

export default function Notes() {
  const location = useLocation();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1);  
  
  const handleNoteSave = (id: number, title: string, content: string, tags: string[]) => {
    setLoadingSave(true);
    updateNote(id ,title, content, tags)
      .then((result)=>{
        if(result.success) {
          setLoadingSave(false);
          loadNotes();
        }
        else 
          alert(result.message);
      })
  }
  
  const handleNoteDelete = (id: number) => {
    setLoadingDelete(true);
    deleteNote(id)
      .then((result)=>{
        if(result.success) {
          setLoadingDelete(false);
          loadNotes();
        }
        else 
          alert(result.message);
      })
  }

  const loadNotes = () => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const tags = searchParams.getAll("tag");

    getFiltedNotes(page, query, tags)
      .then((result) => {
        if (result.success) {
          setNotes(result.notes);
          setTotalPages(result.pages);
        } else {
          alert(result.message);
          navigate("/login");
        }
      })
      .catch(() => {
        alert("載入筆記失敗");
        navigate("/login");
      });
  }

  // test
  const allTestNotes: Note[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    date: "2025-07-14",
    title: `筆記 ${i + 1}`,
    content: `這是第 ${i + 1} 筆測試內容`,
    tags: i % 2 === 0 ? ["work"] : ["log"],
  }));


  useEffect(() => {
    loadNotes()
    
    // test 
    // const perPage = 10;
    // const start = (page - 1) * perPage;
    // const end = start + perPage;
    // const pagedNotes = allTestNotes.slice(start, end);

    // setNotes(pagedNotes);
    // setTotalPages(Math.ceil(allTestNotes.length / perPage));
  }, [page]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.notesContainer}>
        {notes.map((note)=>{
          return(
            <NoteEditor id={note.id} title={note.title} content={note.content} tags={note.tags} onDeleted={handleNoteDelete} onSaved={handleNoteSave} loading={loadingDelete || loadingSave}/>
          )
        })}
      </div>
      <div className={styles.pageSelector}>
        {Array.from({ length: totalPages }, (_, i) => (
          <div
            key={i}
            className={`${styles.page} ${page === i + 1 ? styles.active : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}