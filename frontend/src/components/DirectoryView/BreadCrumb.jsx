import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BreadCrumb({
    pathArray = [],
    currentDirId = ""
}) {

    const navigate = useNavigate();

    if (!pathArray.length || !currentDirId) return;
    return (
        <div className="w-full px-4 py-2 rounded-md bg-secodary-dark border  border-white/12 ">
            <ul className="flex gap-2 text-text-gray">
                {pathArray?.map(({ _id, name }) => {
                    const isLast = currentDirId === _id;
                    const displayName = name.toLowerCase().includes("root") ? "root" : name;
                    
                    return (
                    <li key={_id} className="flex gap-1 items-center justify-between">
                        <Link
                            to={`/my-drive/folder/${_id}`}
                            className={`transition-colors capitalize hover:text-custom-white ${isLast ? "text-custom-cyan font-medium" : "cursor-pointer"
                                }`}
                        >
                            {displayName}
                        </Link>
                        {!isLast && <FaAngleRight size={12} className="opacity-50" />}
                    </li> )
                })}
            </ul>
        </div>
    )
}

export default BreadCrumb;