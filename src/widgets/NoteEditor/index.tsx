import { useState } from "react";
import styles from "./index.module.scss";
import { Tags } from "../../constants/Tags";

type Note = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  onSaved: (id: number, title: string, content: string, tags: string[])=>void;
  onDeleted: (id: number)=>void;
  loading: boolean;
};

export default function NoteEditor({id, title, content, tags, onSaved, onDeleted, loading}: Note) {
  const [opened, setOpened] = useState<boolean>(false);
  const [addingTag, setAddingTag] = useState<boolean>(false);

  const [changedTitle, setChangedTitle] = useState<string>(title);
  const [changedContent, setChangedContent] = useState<string>(content);
  const [changedTags, setChangedTags] = useState<string[]>(tags);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label} onClick={()=>{setOpened(!opened)}}>{title}</div>
      {opened &&
        <div className={styles.editor}>
          <div className={styles.titleInput}>
            <a>Title</a>
            <input value={changedTitle} onChange={(e)=>{setChangedTitle(e.target.value)}}/>
          </div>
          <div className={styles.ContentInput}>
            <a>Content</a>
            <input value={changedContent} onChange={(e)=>{setChangedContent(e.target.value)}}/>
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
            <div 
              className={`${styles.button} ${changedTitle != title && changedContent != content && changedTags != tags && !loading ? styles.disable : ""}`}
              onClick={()=>{if(changedTitle != title && changedContent != content && changedTags != tags && !loading) onSaved(id, title, content, tags)}}
            >
              Save
            </div>
            <div 
              className={`${styles.button} ${loading ? styles.disable : ""}`}
              onClick={()=>{onDeleted(id)}}
            >
              Delete
            </div>
          </div>
        </div>
      }
    </div>
  );
};