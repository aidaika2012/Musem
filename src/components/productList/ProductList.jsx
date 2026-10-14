import React from 'react'
import Card from '../card/Card'
import "./style.css"

export default function ProductList({food}) {
  return (
    <div className='foods'>
        {
            food.map((el)=>(
                <Card data={el} key={el.idMeal}/>
            ))
        }
    </div>
  )
}
