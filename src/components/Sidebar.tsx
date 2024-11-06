import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars , faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
export function Sidebar() {
    return (
        <aside className="ml-0 w-20 h-screen bg-gray-800">
            <div className="text-center mt-9">
                <button>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <div className="text-center mt-9">
                <button>
                    <FontAwesomeIcon icon={faHouse} />
                </button>
            </div>
            <div className="text-center mt-9">
                <button>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </aside>
    );
}