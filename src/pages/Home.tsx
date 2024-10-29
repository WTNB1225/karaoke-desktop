import "../App.css";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
function App() {

  return (
    <div className={`grid grid-cols-[auto,1fr] w-full h-screen bg-gray-950 `}>
      <Sidebar />
      <div className="p-4">
        <h1 className="mb-5 text-4xl ml-3 mt-5">Home</h1>
        <div className="flex">
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?1" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?2" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?3" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?4" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?5" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?6" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?7" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?8" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?9" />
          <Card title="title" author="author" imageUrl="https://picsum.photos/640/480?10" />
        </div>
      </div>
    </div>
  );
}

export default App;
