import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import "./main.css"

function App() {
  const params = useParams();
  const [gallery, setGallery] = useState([]);
  const [active, setActive] = useState(parseInt(params.index || "0", 10));
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/gallery/list")
      .then(response => response.json())
      .then(data => setGallery(data));
  }, []);

  useEffect(() => {
    if (gallery.length) {
      setImages([]);
      fetch(`http://localhost:3001/gallery/image/list?g=${gallery[active]}`)
        .then(response => response.json())
        .then(data => setImages(data));
    }
  }, [gallery, active]);

  return (
    <div className="App w-full h-screen flex flex-col">
      <nav className="border-b border-neutral-200 w-full p-6 px-8 flex justify-center items-center">
        <h1 className="tracking-[0.325em] font-medium text-neutral-700">GALLERIA</h1>
      </nav>
      <div className="flex h-full min-h-0">
        <div className="p-6 w-80 border-r border-neutral-200">
          <h2 className="font-semibold text-neutral-700 tracking-[0.325em] uppercase text-sm">Gallery List</h2>
          <div className="flex flex-col gap-3 mt-4 border-l-2 border-neutral-100">
            {gallery.map((item, index) => (
              <a href={"/"+index} key={item} className={`tracking-[0.1em] pl-4 text-sm truncate text-left ${index === active ? "border-l-2 -ml-[2px] border-yellow-400 text-neutral-700" : "text-neutral-400"}`}>{item}</a>
            ))}
          </div>
        </div>
        <div className="p-6 py-24 w-full h-full overflow-y-auto min-h-0">
          {images.length && <div className="w-full flex flex-wrap gap-2 justify-center">
            {images.slice(0, page * 20 + 20).map(e => <img width="256" src={
              `http://localhost:3001/gallery/image/get?g=${encodeURIComponent(gallery[active])}&i=${encodeURIComponent(e)}`
            } className="max-w-[20rem] aspect-[4/3] object-cover" />)}
          </div>}
          <button className="w-full bg-yellow-500 text-white uppercase font-medium tracking-[0.325em] mt-4 py-5 text-sm" onClick={() => setPage(page + 1)}>Load more</button>
        </div>
      </div>
    </div>
  )
}

function Main() {
  return <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/0" />} />
      <Route path="/:index" element={<App />} />
    </Routes>
  </Router>
}

export default Main
