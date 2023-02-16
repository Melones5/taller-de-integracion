import React, { useState } from 'react'

const ProductComment = () => {
  const [comentario, setComentario] = useState("")
  const [comentarios, setComentarios] = useState([]);

  const onClickHandler = () =>{
    setComentarios((comentarios) => [...comentarios, comentario]);
  }
  const onChangeHandler = (e) =>{
    setComentario(e.target.value);
  }

  return (
    <div className='main-container'>
      {comentarios.map((texto)=>(
        <div className='comment-container'>{texto}</div>
      ))}
      <div>
        <h3>Comentario</h3>
        <textarea 
          value={comentario}
          onChange={onChangeHandler}
          className="input-box"      
        />
        <button onClick={onClickHandler}>comentar</button>
      </div>
    </div>
  )
}

export default ProductComment