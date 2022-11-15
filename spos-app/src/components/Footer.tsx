import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-neutral-100 text-slate-500 text-center text-xs p-3 fixed bottom-0 w-full">
      <div >
          stock based point of sales system (or a calculator) -{" "}
          <a
            className="text-slate-600"
            href="https://github.com/sebastiannicolajsen/spos"
          >
            https://github.com/sebastiannicolajsen/spos
          </a>
      </div>
    </footer>
  );
}

export default Footer;
