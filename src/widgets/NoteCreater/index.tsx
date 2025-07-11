import { useState } from "react";
import styles from "./index.module.scss";
import { Tags } from "../../constants/Tags";

type NoteCreaterProps = {
  date: string;
  onCreated: (title: string, content: string, date: string, tags: string[])=>void;
  loading: boolean;
};

export default function NoteCreater({date, onCreated, loading}: NoteCreaterProps) {
  const [addingTag, setAddingTag] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputField}>
        <div className={styles.titleInput}>
          <a>Title</a>
          <input value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
        </div>
        <div className={styles.ContentInput}>
          <a>Content</a>
          <input value={content} onChange={(e)=>{setContent(e.target.value)}}/>
        </div>
      </div>
      <div className={styles.tagField}>
        { tags.map((tag)=>{
          return (
            <div className={styles.tag} onClick={()=>{}}>
              {tag}
            </div>
          )
        })}
        <div className={styles.addButton} onClick={()=>setAddingTag(true)}>+add</div>
        { addingTag &&
          <div className={styles.tagsContainer}>
            {Tags.map((tag)=>{
              if (!tags.includes(tag))
              return (
                <div className={styles.tagOption} onClick={()=>{}}>
                  {tag}
                </div>
              )
            })}                
          </div>
        }
      </div>
      <div className={styles.actions}>
        <div className={`${styles.button} ${loading ? styles.disable : ""}`} onClick={()=>{onCreated(title, content, date, tags)}}>
          Add
        </div>
      </div>
    </div>
  );
};