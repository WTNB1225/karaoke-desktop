import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import {invoke} from "@tauri-apps/api/core";

export function RecentlyPlayedCard(props: { title: string, author: string, imageUrl: string }) {
    return (
        <div className="flex mt-5 items-center relative" style={{width: "5rem"}}> {/* 右側の余白を追加 */}
            <img src={props.imageUrl} alt="image" className="rounded-md w-16 h-16" />
            <div className="ml-4">
                <p className="text-2xl">{props.title}</p>
                <p className="text-1xl text-[#9ca3af]">{props.author}</p>
            </div>
            {/* FontAwesomeIconを右端に固定 */}
            <a href="/play">
                <FontAwesomeIcon icon={faCirclePlay} className="absolute left-64 w-8 h-8" />
            </a>
            <button onClick={printCommand}>
                hogehoge
            </button>
        </div>
    );
}

async function printCommand() {
    await invoke("print_command");
}
