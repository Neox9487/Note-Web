import { useState } from "react";
import styles from "./index.module.scss";
import { Tags } from "../../constants/Tags";

type Note = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  date: string,
  onSaved: (id: number, title: string, content: string, tags: string[]) => void;
  onDeleted: (id: number) => void;
  loading: boolean;
};

export default function NoteEditor({
  id,
  title,
  content,
  tags,
  date,
  onSaved,
  onDeleted,
  loading,
}: Note) {
  const [opened, setOpened] = useState<boolean>(false);
  const [addingTag, setAddingTag] = useState<boolean>(false);

  const [changedTitle, setChangedTitle] = useState<string>(title);
  const [changedContent, setChangedContent] = useState<string>(content);
  const [changedTags, setChangedTags] = useState<string[]>(tags);

  const changed =
    changedTitle !== title ||
    changedContent !== content ||
    JSON.stringify(changedTags) !== JSON.stringify(tags);

  const transformDateString = (date:string) => {
    const year = date.slice(0,4);
    const month = date.slice(4,6);
    const day = date.slice(6,8);

    return(`${year}/${month}/${day}`);
  }

  return (
    <div key={id} className={styles.wrapper}>
      <div className={styles.label}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{transformDateString(date)}</div>
        <div 
          className={styles.triangle} 
          onClick={() => {
            setOpened(!opened);
            setChangedTags(tags);
          }}>
            {opened ? "▲" : "▼"}
        </div>
      </div>
      {opened && (
        <div className={styles.editor}>
          <div className={styles.titleInput}>
            <a>Title</a>
            <input
              value={changedTitle}
              onChange={(e) => setChangedTitle(e.target.value)}
            />
          </div>
          <div className={styles.contentInput}>
            <textarea
              value={changedContent}
              onChange={(e) => setChangedContent(e.target.value)}
            />
          </div>
          <div className={styles.tagField}>
            {changedTags.map((tag) => (
              <div 
                className={styles.tag} 
                key={tag} 
                onClick={()=>{setChangedTags(changedTags.filter(_tag => _tag !== tag))}}
              >
                {tag}
              </div>
            ))}
            {!addingTag && <div className={styles.addButton} onClick={() => setAddingTag(true)}>+add</div>}
            {addingTag && (
              <div className={styles.tagsContainer}>
                {Tags.filter((tag) => !changedTags.includes(tag)).map((tag) => (
                  <div
                    className={styles.tagOption}
                    key={tag}
                    onClick={() => {
                      setChangedTags([...changedTags, tag]);
                      setAddingTag(false);
                    }}
                  >
                    {tag}
                  </div>
                ))}
              <div className={styles.doneButton} onClick={() => setAddingTag(false)}>Done</div>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <div
              className={`${styles.button} ${loading ? styles.disable : styles.enable}`}
              onClick={() => {
                if (!loading) {
                  onDeleted(id);
                }
              }}
            >
              Delete
            </div>
            <div
              className={`${styles.button} ${!changed || loading ? styles.disable : styles.enable}`}
              onClick={() => {
                if (changed && !loading) {
                  onSaved(id, changedTitle, changedContent, changedTags);
                }
              }}
            >
              Save
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
