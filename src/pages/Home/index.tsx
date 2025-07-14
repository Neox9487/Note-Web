import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

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

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    loadNotes();

    // test
    // const testNotes = [
    //   { id: 11, date: "20250712", title: "週會紀要", content: "與團隊討論新版 API 設計與時程。", tags: ["meeting", "api"] },
    //   { id: 12, date: "20250711", title: "健檢報告摘要", content: "膽固醇偏高，需要注意飲食與運動。", tags: ["health", "summary"] },
    //   { id: 13, date: "20250710", title: "旅行計畫草稿", content: "預計 8 月中旬前往日本京都五日遊。", tags: ["travel", "plan", "draft"] },
    //   { id: 14, date: "20250709", title: "產品命名腦力激盪", content: "嘗試以動物或自然為靈感發想產品名稱。", tags: ["brainstorm", "idea"] },
    //   { id: 15, date: "20250708", title: "重構 login 流程", content: "將登入流程邏輯拆分為三層結構：驗證 / 存取 / 導向。", tags: ["debug", "setup"] },
    //   { id: 16, date: "20250706", title: "7 月讀書紀錄", content: "閱讀《原子習慣》前五章筆記與反思。", tags: ["book", "habit", "journal"] },
    //   { id: 17, date: "20250703", title: "新功能待辦清單", content: "1. 搜尋功能\n2. 匯出 CSV\n3. 簡報模式", tags: ["todo", "task", "priority"] },
    //   { id: 18, date: "20250701", title: "六月財務整理", content: "收入：78,000；支出：52,400；結餘：25,600", tags: ["finance", "log", "summary"] },
    //   { id: 19, date: "20250629", title: "提問清單", content: "1. 如何安全處理 token？\n2. 為何 useEffect 會重複觸發？", tags: ["question", "debug"] },
    //   { id: 20, date: "20250620", title: "想法草稿：AI 知識筆記工具", content: "以 tag 與關聯為核心，支援 markdown 編輯與引用 API 整合。", tags: ["idea", "draft", "wishlist"] }
    // ];
    // setNotes(testNotes);
  }, [currentYear, currentMonth, navigate]);

  const loadNotes = () => {
    getNotesByMonth(currentYear, currentMonth + 1)
      .then((result) => {
        if (result.success) {
          setNotes(result.notes);
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
        else {
          alert(result.message);
          navigate("/login");
        }
      })
      .catch(()=>{
        alert("發生未知錯誤，請重新登入");
        navigate("/login");
      });
  }

  const handleNoteDelete = (id: number) => {
    setLoadingDelete(true);
    deleteNote(id)
      .then((result)=>{
        if(result.success) {
          setLoadingDelete(false);
          loadNotes();
        }
        else {
          alert(result.message);
          navigate("/login");
        }
      })
      .catch(()=>{
        alert("發生未知錯誤，請重新登入");
        navigate("/login");
      });
  }

  const handleAddNote = (title: string, content: string, date:string, tags: string[]) => {
    setLoadingAdd(true);
    addNote(title, content, date, tags)
      .then((result)=>{
        if(result.success) {
          setLoadingAdd(false);
          loadNotes();
        }
        else  alert(result.message);
      })
      .catch(()=>{
        alert("發生未知錯誤，請重新登入");
        navigate("/login");
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

        { level == "month" &&
          <div className={styles.weekdays}>
            {weekdays.map((day, i) => (
              <div key={i} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>
        }

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
                      className={`${styles.dayBox} ${styles.valid} ${selectedDate==ymd ? styles.selected : ""} ${noteCountMap[ymd]? styles.haveNote : ""}`}
                      key={i}
                      onClick={() => {setSelectedDate(ymd); setAdding(false)}}
                    >
                      {dayNum}
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
        <div className={styles.notesContainer}>
          {notes.filter((note) => note.date === selectedDate).length === 0 && !adding && <div className={styles.notesLabel}>這個日期沒有筆記</div>}
          {notes.map((note)=>{
            if (note.date === selectedDate) 
              return(
                <NoteEditor id={note.id} title={note.title} content={note.content} tags={note.tags} date={note.date} onSaved={handleNoteSave} onDeleted={handleNoteDelete} loading={loadingAdd || loadingDelete || loadingSave}/>
              )
          })}
          {!adding && <div className={styles.button} onClick={()=>setAdding(true)}>新增</div>}
          {adding && <NoteCreater date={selectedDate} onCreated={handleAddNote} onCancel={()=>setAdding(false)} loading={loadingAdd || loadingDelete || loadingSave} />}
        </div>
      </div>
    </div>
  );
}
