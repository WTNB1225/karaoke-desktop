export default function Card(props: {title: string, author: string, imageUrl: string}) {
    return (
        <div className="w-64 h-64 bg-gray-800 m-2 p-2">
            <h1 className="text-lg">{props.title}</h1>
            <p className="text-sm">{props.author}</p>
            <img className="rounded" src={props.imageUrl} alt="image" />
        </div>
    );
}