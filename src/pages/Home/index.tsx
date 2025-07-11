import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

import { Tags } from "../../constants/Tags";

import addNote from "../../api/note/addNote";
import updateNote from "../../api/note/updateNote";
import deleteNote from "../../api/note/deleteNote";
import getNotesByMonth from "../../api/note/getNotesByMonth";

import NoteEditor from "../../widgets/NoteEditor";
import NoteCreater from "../../widgets/NoteCreater";

type Note = {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
};


export default function Home() {
  const today = new Date();
  const [level, setLevel] = useState<string>("month");
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteCountMap, setNoteCountMap] = useState<Record<string, number>>({});
  const [adding, setAdding] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const navigate = useNavigate();

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    const countMap: Record<string, number> = {};
    notes.forEach((note) => {
      countMap[note.date] = (countMap[note.date] || 0) + 1;
    });
    setNoteCountMap(countMap);
  }, [notes]);

  useEffect(() => {
    // loadNotes();

    // test
    const testNotes = [
      { id: 1, date: "20250701", title: "Note 1", content: "內容 A", tags: ["work"] },
      { id: 66, date: "20250701", title: "Note 22", content: "內容 @@@@", tags: ["work"] },
      { id: 2, date: "20250501", title: "Note 2", content: "內容 B", tags: ["life"] },
      { id: 3, date: "20250603", title: "Note 3", content: "內容 C", tags: [] },
      { id: 4, date: "20250705", title: "Note 4", content: "內容 D", tags: ["idea"] },
      { id: 5, date: "20250805", title: "Note 5", content: "內容 E", tags: [] },
      { id: 6, date: "20250710", title: "Note 6", content: "內容 F", tags: ["plan"] },
      { id: 7, date: "20250710", title: "Note 7", content: "內容 G", tags: ["plan"] },
      { id: 8, date: "20250815", title: "Note 8", content: "內容 H", tags: [] },
      { id: 9, date: "20250920", title: "Note 9", content: "內容 I", tags: ["project"] },
      { id: 10, date: "20250731", title: "Note 10", content: "內容 J", tags: ["end"] },
    ];
    setNotes(testNotes);
  }, [currentYear, currentMonth, navigate]);

  const loadNotes = () => {
    getNotesByMonth(currentYear, currentMonth + 1)
      .then((result) => {
        if (result.success) {
          setNotes(result.notes);
        } else {
          alert(result.message);
        }
      })
      .catch(() => {
        alert("載入筆記失敗");
        navigate("/login");
      });
  }

  const handlePrev = () => {
    if (level === "year") {
      setCurrentYear(currentYear - 1);
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const handleNext = () => {
    if (level === "year") {
      setCurrentYear(currentYear + 1);
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateClick = () => {
    setLevel(level === "year" ? "month" : "year");
  };

  const handleMonthClick = (month: number) => {
    setCurrentMonth(month);
    setLevel("month");
  };

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

  const handleAddNote = (title: string, content: string, date:string, tags: string[]) => {
    setLoadingAdd(true);
    addNote(title, content, date, tags)
      .then(()=>{

      });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <div className={styles.date} onClick={handleDateClick}>
            {level === "month"
              ? `${currentYear} / ${String(currentMonth + 1).padStart(2, "0")}`
              : `${currentYear}`}
          </div>
          <div className={styles.actions}>
            <div className={styles.button} onClick={handlePrev}>◀</div>
            <div className={styles.button} onClick={handleNext}>▶</div>
          </div>
        </div>

        <div className={styles.body}>
          {level === "year" && (
            <div className={styles.monthGrid}>
              {months.map((name, i) => (
                <div
                  key={i}
                  className={styles.cell}
                  onClick={() => handleMonthClick(i)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}

          {level === "month" && (
            <div className={styles.dateGrid}>
              {Array.from({ length: 42 }).map((_, i) => {
                const dayNum = i - startDay + 1;
                const isValid = dayNum > 0 && dayNum <= daysInMonth;
                const y = currentYear.toString();
                const m = String(currentMonth + 1).padStart(2, "0");
                const d = String(dayNum).padStart(2, "0");
                const ymd = `${y}${m}${d}`;
                if (isValid)
                  return (
                    <div
                      className={`${styles.dayBox} ${styles.valid}`}
                      key={i}
                      onClick={() => setSelectedDate(ymd)}
                    >
                      <p className={styles.day}>{dayNum}</p>
                      <div className={styles.dotContainer}>
                        {Array.from({ length: noteCountMap[ymd] || 0 }).map((_, i) => (
                          <span key={i} className={styles.dot} />
                        ))}
                      </div>
                    </div>
                  );
                else
                  return <div className={`${styles.dayBox} ${styles.invalid}`} key={i}>-</div>;
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.notes}>
        {notes.length === 0 && <div className={styles.notesLabel}>這個日期沒有筆記</div>}
        {notes.map((note)=>{
          if (note.date === selectedDate) {}
            return(
              <NoteEditor id={note.id} title={note.title} content={note.content} tags={note.tags} onSaved={handleNoteSave} onDeleted={handleNoteDelete} loading={loadingAdd || loadingDelete || loadingSave}/>
            )
        })}
        {!adding && <div className={styles.button} onClick={()=>setAdding(true)}>+add</div>}
        {adding && <NoteCreater date={selectedDate} onCreated={handleAddNote} loading={loadingAdd || loadingDelete || loadingSave}/>}
      </div>
    </div>
  );
}
