import { useState } from "react";
import styles from "./index.module.scss";
import { Tags } from "../../constants/Tags";

type NoteCreaterProps = {
  date: string;
  onCreated: (title: string, content: string, date: string, tags: string[])=>void;
  onCancel: ()=>void;
  loading: boolean;
};

export default function NoteCreater({date, onCreated, onCancel, loading}: NoteCreaterProps) {
  const [addingTag, setAddingTag] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div key="creator" className={styles.wrapper}>
      <div className={styles.label}>
        <div className={styles.title} >
          新增筆記
        </div>
        <div 
          className={styles.cancel} 
          onClick={()=>{if(!loading) onCancel()}}
        >
          取消
        </div>
      </div>
      <div className={styles.inputField}>
        <div className={styles.titleInput}>
          <a>Title</a>
          <input value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
        </div>
        <div className={styles.contentInput}>
          <a>Content</a>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>
      <div className={styles.tagField}>
        {tags.map((tag)=>{
          return (
            <div key={tag} className={styles.tag} onClick={()=>{setTags(tags.filter(_tag => _tag !== tag))}}>
              {tag}
            </div>
          )
        })}
        {!addingTag && <div className={styles.addButton} onClick={()=>setAddingTag(true)}>+add</div>}
        {addingTag && (
          <div className={styles.tagsContainer}>
            {Tags.filter((tag) => !tags.includes(tag)).map((tag) => {
              const isSelected = tags.includes(tag);
              return (
                <div
                  key={tag}
                  className={`${styles.tagOption} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setTags(tags.filter((t) => t !== tag));
                    } else {
                      setTags([...tags, tag]);
                    }
                  }}
                >
                  {tag}
                </div>
              );
            })}
            <div className={styles.closeButton} onClick={() => setAddingTag(false)}>Close</div>
          </div >
        )}
      </div>
      <div className={styles.actions}>
        <div 
          className={`${styles.button} ${loading ? styles.disable : ""}`} 
          onClick={()=>{
            if (!loading && title.trim() && content.trim()) {
              onCreated(title, content, date, tags);
            }
          }}
        >
          Add
        </div>
      </div>
    </div>
  );
};