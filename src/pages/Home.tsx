
import "../App.css";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { RecentlyPlayedCard } from "@/components/RecentlyPlayedCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

function App() {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const { windowWidth, windowHeight } = useWindowSize();
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "right" | "left") => {
    if (!cardRef.current) return;
    const scrollAmount = 320;
    const currentScroll = cardRef.current.scrollLeft;
    if (direction == "left") {
      cardRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: "smooth"
      });
      setScrollPosition(currentScroll - scrollAmount);
    } else if (direction == "right") {
      cardRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth"
      });
      setScrollPosition(currentScroll + scrollAmount);
    }

  }

  useEffect(() => {
    const target = document.getElementById("card");
    if (target) {
      if (windowWidth < target.scrollWidth) {
        setIsOverflowed(true);
      } else {
        setIsOverflowed(false);
      }
    }
  }, [windowWidth]);

  return (
    <div className={`grid grid-cols-[auto,1fr] w-full overflow-hidden h-screen bg-gray-950 `}>
      <Sidebar />
      <div className="p-4">
        <h1 className="mb-3 text-4xl ml-3 mt-3">Home</h1>
        <div id="card" className="flex overflow-x-auto hide-scrollbar" ref={cardRef} style={{ width: windowWidth - 100 }}>
          <div className="flex gap-4">
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?1" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?2" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?3" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?4" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?5" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?6" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?7" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?8" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?9" />
            <Card title="title" author="hogehoge" imageUrl="https://picsum.photos/640/480?10" />
          </div>
        </div>
        {isOverflowed && cardRef.current &&
          <>
            {scrollPosition < cardRef.current?.scrollWidth - cardRef.current?.clientWidth && (
              <button onClick={() => scroll("right")}>
                <FontAwesomeIcon icon={faCircleChevronRight} className="absolute right-0 top-1/4 w-12 h-12" />
              </button>
            )}
            {scrollPosition > 0 && (
              <button onClick={() => scroll("left")}>
                <FontAwesomeIcon icon={faCircleChevronLeft} className="absolute top-1/4 w-12 h-12" />
              </button>
            )}
          </>

        }
        <div className="grid grid-cols-4">
          <div className="">
            <h2 className="ml-3 text-4xl mt-3">Recently Played</h2>
            <div className="flex flex-col ml-3 h-80 overflow-y-auto hide-scrollbar">
              <RecentlyPlayedCard title="hogehoge" author="foobar" imageUrl="https://picsum.photos/640/640?11" />
              <RecentlyPlayedCard title="fizzbazz" author="hoge" imageUrl="https://picsum.photos/640/640?12" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?13" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?14" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?15" />
            </div>
          </div>
          <div className="">
            <h2 className="ml-3 text-4xl mt-3">Favorite</h2>
            <div className="flex flex-col ml-3 h-80 overflow-y-auto hide-scrollbar">
              <RecentlyPlayedCard title="hogehoge" author="foobar" imageUrl="https://picsum.photos/640/640?11" />
              <RecentlyPlayedCard title="fizzbazz" author="hoge" imageUrl="https://picsum.photos/640/640?12" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?13" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?14" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?15" />
            </div>
          </div>
          <div className="">
            <h2 className="ml-3 text-4xl mt-3">Recommend</h2>
            <div className="flex flex-col ml-3 h-80 overflow-y-auto hide-scrollbar">
              <RecentlyPlayedCard title="hogehoge" author="foobar" imageUrl="https://picsum.photos/640/640?11" />
              <RecentlyPlayedCard title="fizzbazz" author="hoge" imageUrl="https://picsum.photos/640/640?12" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?13" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?14" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?15" />
            </div>
          </div>
          <div className="">
            <h2 className="ml-3 text-4xl mt-3">Top</h2>
            <div className="flex flex-col ml-3 h-80 overflow-y-auto hide-scrollbar">
              <RecentlyPlayedCard title="hogehoge" author="foobar" imageUrl="https://picsum.photos/640/640?11" />
              <RecentlyPlayedCard title="fizzbazz" author="hoge" imageUrl="https://picsum.photos/640/640?12" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?13" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?14" />
              <RecentlyPlayedCard title="piyopiyo" author="hoge" imageUrl="https://picsum.photos/640/640?15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
