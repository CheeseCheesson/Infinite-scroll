import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './app.css'

const App = () => {
  const [photos, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (fetching) {
      axios.get(`https://api.github.com/search/repositories?q=stars%3A%3E0&sort=stars&order=desc&page=${currentPage}`)
        .then((response) => {
          console.log(response);
          setData([...photos, ...response.data.items])
          setCurrentPage(prevState => prevState + 1)
          setTotalCount(response.data.total_count)
        })
        .finally(() => { setFetching(false) })
    }
  }, [fetching, currentPage, photos])



  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return function () {
      document.removeEventListener('scroll', scrollHandler)
    }
  })

  const scrollHandler = ({ target }) => {
    const { scrollHeight } = target.documentElement
    const { scrollTop } = target.documentElement
    const { innerHeight } = window
    // из общей высоты страницы с учётом прокрутки отнимаем
    // сумму видимой обрасти + текущее состояние от верха страницы(видимая часть окна браузера)
    if (scrollHeight - (scrollTop + innerHeight) < 100 && (photos.length < totalCount)) {
      setFetching(true);
    }
  }

  return (<>
    <div className="grid-container">
      {photos.map(i => (
        <div className="card" key={i.id}>
          <>
            <a target="blank" href={i.owner['html_url']}><div className="title">
              {i.owner['login']}
            </div>
            </a>
            <div className="star">
              <svg class="svg-star" width="100" height="200" viewBox="0 0 84 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42 0L51.8786 25.5664H83.8465L57.9839 41.3673L67.8625 66.9336L42 51.1327L16.1374 66.9336L26.0161 41.3673L0.153515 25.5664H32.1214L42 0Z" fill="yellow" />
              </svg>
              <div className="text">
                 {i.stargazers_count}
              </div>
             
            </div>
            <div className="image">
              <a target="blank" href={i.owner['html_url']}>
                <img src={i.owner['avatar_url']} alt={i.owner['login']} />
              </a>
            </div>
          </>
        </div>
      ))
      }
    </div>
  </>);
}

export default App;