import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import {io} from 'socket.io-client'

const tools=[
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
[{ font: []}],
[{ list: "ordered" }, { list: "bullet"}],
["bold", "italic", "underline"],
[{ color: [] }, { background: [] }],
[{ script: "sub" }, { script: "super" }],
[{ align: []}],
["image", "blockquote", "code-block"],
["clean"],
]
const Editor = () => {
  const[socket, setSocket]=useState();
  const[quill, setQuill]=useState();
  useEffect(()=>{
    const s=io("http://localhost:3001/");
    setSocket(s);
    return ()=>{
      s.disconnect();
    }
  }, [])
  const refBox=useCallback(wrapper=>{
    if(wrapper==null) return


    wrapper.innerHTML=""
    const editor=document.createElement("div");
    wrapper.append(editor);
      const q= new Quill(editor, {
        theme:"snow", 
        modules:{toolbar:tools}
      });
      setQuill(q);
  }, [])

  useEffect(()=>{
    if(socket == null || quill==null) return
    const handler=(delta, oldDelta, source)=>{
      if(source!='user') return
      socket.emit("send-changes", delta)
    }
    quill.on('text-change', handler)

    return ()=>{
      quill.off('text-change', handler )
    }
  }, [socket, quill])

  return (
    <div className='container' ref={refBox}></div>
  )
}

export default Editor